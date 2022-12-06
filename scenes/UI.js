class UI extends Phaser.Scene {

  constructor() {

    super("UI");
  }
  preload() {



  }
  create() {

    /* this.header = this.add.image(game.config.width / 2, 15, 'blank').setOrigin(.5, 0).setTint(0x3e5e71);
    this.header.displayWidth = 870;
    this.header.displayHeight = 200; */


    this.score = 0;
    //this.scoreText = this.add.bitmapText(85, 100, 'topaz', this.score, 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);

    this.scoreText = this.add.text(100, 100, this.score, { fontFamily: 'PixelFont', fontSize: '100px', color: '#F0B060', align: 'left' }).setOrigin(1, .5)

    this.squareText = this.add.text(200, 100, this.score, { fontFamily: 'PixelFont', fontSize: '100px', color: '#F0B060', align: 'left' }).setOrigin(1, .5)



    this.Main = this.scene.get('playGame');
    this.Main.events.on('score', function () {

      //console.log('dots ' + string)
      this.scoreText.setText(this.Main.moves)
      this.squareText.setText(this.Main.squares)
      for (var i = 0; i < dotColors.length; i++) {
        this.tallyArray[i].setText(tally[i])
      }
    }, this);
    this.Main.events.on('oneDot', function () {
      this.Main.oneDot = false
      oneDotText.setColor('#ffffff')
    }, this);
    this.Main.events.on('oneColor', function () {
      this.Main.oneColor = false
      oneColorText.setColor('#ffffff')
    }, this);

    var oneDotText = this.add.text(50, 1400, '1 DOT', { fontFamily: 'PixelFont', fontSize: '90px', color: '#ffffff', align: 'left' }).setOrigin(0, .5).setInteractive()
    oneDotText.on('pointerdown', function () {
      if (this.Main.oneDot) {
        oneDotText.setColor('#ffffff')
        this.Main.oneDot = false
      } else {
        oneDotText.setColor('#ff0000')
        this.Main.oneDot = true
      }
    }, this)
    var oneColorText = this.add.text(350, 1400, '1 COLOR', { fontFamily: 'PixelFont', fontSize: '90px', color: '#ffffff', align: 'left' }).setOrigin(0, .5).setInteractive()
    oneColorText.on('pointerdown', function () {
      if (this.Main.oneColor) {
        oneColorText.setColor('#ffffff')
        this.Main.oneColor = false
      } else {
        oneColorText.setColor('#ff0000')
        this.Main.oneColor = true
      }
    }, this)
    var shuffleText = this.add.text(650, 1400, 'SHUFFLE', { fontFamily: 'PixelFont', fontSize: '90px', color: '#ffffff', align: 'left' }).setOrigin(0, .5).setInteractive()
    shuffleText.on('pointerdown', function () {
      this.Main.shuffleBoard()
    }, this)

    var dotSize = 150
    this.xOffset = (game.config.width - (dotColors.length * dotSize)) / 2
    this.tallyArray = []
    for (var i = 0; i < dotColors.length; i++) {
      var testDot = this.add.image(this.xOffset + dotSize * i + dotSize / 2, 1580, dotKey).setTint(dotColors[i])
      testDot.displayWidth = this.Main.spriteSize * .75
      testDot.displayHeight = this.Main.spriteSize * .75
      var tallyText = this.add.text(this.xOffset + dotSize * i + dotSize / 2, 1580 - (this.Main.spriteSize * .75) / 1.5, '0', { fontFamily: 'PixelFont', fontSize: '90px', color: '#F0B060', align: 'left' }).setOrigin(.5, 1)
      this.tallyArray.push(tallyText)
    }

  }

  update() {

  }



}