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
    this.rows = 8 //10 max

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


  }
  update() {

  }
  dotSelect(pointer) {
    this.lineArray = []
    this.rectArray = []
    let row = Math.floor((pointer.y - this.yOffset) / this.dotSize);
    let col = Math.floor((pointer.x - this.xOffset) / this.dotSize);
    console.log('row ' + row + ' col ' + col)
    if (!this.board.validCoordinates(col, row)) { return }
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

      }
    }
  }
  dotUp() {
    if (this.board.selectedDots.length > 1) {
      this.moves++
      if (this.board.squareCompleted) {
        this.squares++
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
    } else {
      this.board.resetBoard();
    }
    this.board.dragging = false;

  }

  addScore() {
    this.events.emit('score');
  }
}
