let game;



window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 900,
      height: 1640
    },

    scene: [preloadGame, startGame, playGame, UI]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////
class playGame extends Phaser.Scene {
  constructor() {
    super("playGame");
  }
  preload() {


  }
  create() {

    //this.cameras.main.setBackgroundColor(0x333440);
    this.cameras.main.setBackgroundColor(0x000000);
    dotKey = 'dot2'
    let dotAllColors = colorGroups[0]
    this.dotSize = 110
    this.spriteSize = 85
    this.cols = 8 //8 max
    this.rows = 10 //10 max
    this.allowDrop = true
    this.dropStartCount = 5
    this.allowBomb = true
    this.bombStartCount = 5
    this.movesGoal = 20

    this.numColors = 6
    for (var i = 0; i < this.numColors; i++) {
      dotColors.push(dotAllColors[i])
    }

    this.xOffset = (game.config.width - (this.cols * this.dotSize)) / 2
    this.yOffset = 250
    this.moves = 0
    this.squares = 0
    this.board = new Board(this.cols, this.rows, this)//x,y
    this.board.makeBoard()
    console.log(this.board)
    console.log(this.board.dots)


    this.oneDot = false
    this.oneColor = false

    for (var y = 0; y < this.rows; y++) {
      for (var x = 0; x < this.cols; x++) {
        let posX = this.xOffset + this.dotSize * x + this.dotSize / 2;
        let posY = this.yOffset + this.dotSize * y + this.dotSize / 2
        var dot = this.add.image(posX, posY, dotKey).setTint(dotColors[this.board.dots[x][y].color])
        dot.displayWidth = this.spriteSize
        dot.displayHeight = this.spriteSize
        this.board.dots[x][y].image = dot
      }
    }
    if (this.allowDrop) {
      var placed = 0
      while (placed < this.dropStartCount) {
        var randX = Phaser.Math.Between(0, this.cols - 1)
        var randY = Phaser.Math.Between(0, this.rows - 2)
        if (this.board.dots[randX][randY].type == 0) {
          this.board.dots[randX][randY].selectable = false
          this.board.dots[randX][randY].color = 6
          this.board.dots[randX][randY].type = 1
          this.board.dots[randX][randY].image.setTexture('arrow').setTint(0xF1C40F)
          placed++
        }
      }
    }
    if (this.allowBomb) {
      var placedB = 0
      while (placedB < this.bombStartCount) {
        var randX = Phaser.Math.Between(0, this.cols - 1)
        var randY = Phaser.Math.Between(0, this.rows - 2)
        if (this.board.dots[randX][randY].type == 0) {
          this.board.dots[randX][randY].strength = 3
          this.board.dots[randX][randY].type = 2
          this.board.dots[randX][randY].image.setTexture('dot3')
          placedB++
        }
      }
    }

    /*  for (var i = 0; i < dotColors.length; i++) {
       var testDot = this.add.image(this.dotSize / 2 + this.dotSize * i, 1580, 'dot').setTint(dotColors[i]).setScale(.5)
     } */
    this.input.on("pointerdown", this.dotSelect, this);
    this.input.on("pointermove", this.dotMove, this);
    this.input.on("pointerup", this.dotUp, this);
    /* this.input.on("pointerdown", this.gemSelect, this);
     this.input.on("pointermove", this.drawPath, this);
     this.input.on("pointerup", this.removeGems, this);
    */
    //this.check = this.add.image(725, 1000, 'check').setScale(.7);
    this.squareBox = this.add.graphics();
    this.squareBox.lineStyle(10, 0x00ff00, 1);
    this.squareBox.fillStyle(0x000000, 0);

    this.squareBox.lineStyle(5, 0xffffff, 1);
    this.squareBox.fillStyle(0xffffff, 0);
    this.squareBox.strokeRoundedRect(this.xOffset - 5, this.yOffset - 5, (this.dotSize * this.cols) + 10, (this.dotSize * this.rows + 10), 15);
    this.squareBox.fillRoundedRect(this.xOffset - 5, this.yOffset - 5, (this.dotSize * this.cols) + 10, (this.dotSize * this.rows + 10), 15);

    //this.board.selectRow(4)
    //this.board.selectColumn(4)
    //this.board.selectCross(4, 4)
    const config1 = {
      key: 'burst1',
      frames: 'burst',
      frameRate: 20,
      repeat: 0
    };
    this.anims.create(config1);
    this.bursts = this.add.group({
      defaultKey: 'burst',
      maxSize: 30
    });
  }
  update() {

  }
  makeBoard() {

  }
  dotSelect(pointer) {
    this.lineArray = []
    this.rectArray = []
    let row = Math.floor((pointer.y - this.yOffset) / this.dotSize);
    let col = Math.floor((pointer.x - this.xOffset) / this.dotSize);
    console.log('row ' + row + ' col ' + col)
    if (!this.board.validCoordinates(col, row)) { return }
    if (this.oneDot) {
      this.board.dots[col][row].activate()
      this.board.destroyDots();
      this.moves++
      this.addScore()
      this.useOneDot()
      return
    }
    if (this.oneColor) {
      this.board.dots[col][row].activate()
      this.board.activateSquare(this.board.dots[col][row])
      this.board.destroyDots();
      this.moves++
      this.addScore()
      this.useOneColor()
      return
    }
    this.board.dots[col][row].activate();
    this.board.dragging = true;
    console.log(this.board.selectedDots)
  }
  dotMove(pointer) {
    if (this.board.dragging) {
      let row = Math.floor((pointer.y - this.yOffset) / this.dotSize);
      let col = Math.floor((pointer.x - this.xOffset) / this.dotSize);
      var coor = [col, row]
      var dot = this.board.findDot(coor)
      if (this.board.validDrag(dot) && !this.board.squareCompleted) {
        //new dot
        var line = this.add.line(null, null, this.board.lastSelectedDot().image.x, this.board.lastSelectedDot().image.y, dot.image.x, dot.image.y, dotColors[this.board.selectedColor]).setOrigin(0);
        line.setLineWidth(10)
        this.lineArray.push(line)
        var rect = this.add.rectangle(dot.image.x, dot.image.y, 20, 20, dotColors[this.board.selectedColor])
        this.rectArray.push(rect)
        dot.activate();

      } else if (this.board.secondToLast(dot) && !this.board.squareCompleted) {
        //backtrack
        var line = this.lineArray.pop()
        line.setAlpha(0).destroy()
        var rect = this.rectArray.pop()
        rect.setAlpha(0).destroy()
        this.board.deactivateLastDot();
      } else if (this.board.rightColor(dot) && this.board.isNeighbor(dot) && this.board.completeSquare(dot)) {
        //square
        var line = this.add.line(null, null, this.board.secondToLastSelectedDot().image.x, this.board.secondToLastSelectedDot().image.y, this.board.lastSelectedDot().image.x, this.board.lastSelectedDot().image.y, dotColors[this.board.selectedColor]).setOrigin(0);
        line.setLineWidth(10)
        this.lineArray.push(line)
        var rect = this.add.rectangle(this.board.lastSelectedDot().image.x, this.board.lastSelectedDot().image.y, 20, 20, dotColors[this.board.selectedColor])
        this.rectArray.push(rect)
        this.board.activateSquare(dot);
        this.squareBox.lineStyle(15, dotColors[this.board.selectedColor], 1);
        this.squareBox.strokeRoundedRect(this.xOffset - 5, this.yOffset - 5, (this.dotSize * this.cols) + 10, (this.dotSize * this.rows + 10), 15);
      }
    }
  }
  dotUp() {
    if (this.board.selectedDots.length > 1) {

      if (this.board.squareCompleted) {
        this.squares++
        this.squareBox.lineStyle(5, 0xffffff, 1);
        this.squareBox.strokeRoundedRect(this.xOffset - 5, this.yOffset - 5, (this.dotSize * this.cols) + 10, (this.dotSize * this.rows + 10), 15);
      }
      this.board.destroyDots();

      this.addScore()
      if (this.lineArray.length > 0) {
        this.lineArray.forEach(function (line) {
          line.destroy()
        }.bind(this))
        this.lineArray = []
      }
      if (this.rectArray.length > 0) {
        this.rectArray.forEach(function (rect) {
          rect.destroy()
        }.bind(this))
        this.rectArray = []
      }
      ///////
      if (this.allowDrop) {
        var drops = this.board.findDrops()
        console.log(drops.length)
        if (drops.length > 0) {
          this.board.processDrops(drops)
          this.board.destroyDots()
          this.addScore()
        }
      }
      //////
      this.moves++
    } else {
      this.board.resetBoard();
    }
    this.board.dragging = false;

  }
  explode(x, y) {
    // let posX = this.xOffset + this.dotSize * x + this.dotSize / 2;
    // let posY = this.yOffset + this.dotSize * y + this.dotSize / 2
    var explosion = this.bursts.get().setActive(true);

    // Place the explosion on the screen, and play the animation.
    explosion.setOrigin(0.5, 0.5).setScale(3).setDepth(3);
    explosion.x = this.board.dots[x][y].image.x;
    explosion.y = this.board.dots[x][y].image.y;
    explosion.play('burst1');
    explosion.on('animationcomplete', function () {
      explosion.setActive(false);
    }, this);
  }
  shuffleBoard() {
    this.board.reassignColors()
  }
  addScore() {
    this.events.emit('score');
  }
  useOneDot() {
    this.events.emit('oneDot');
  }
  useOneColor() {
    this.events.emit('oneColor');
  }
}
