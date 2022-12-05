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
    this.xOffset = (game.config.width - (dotColors.length * this.Main.dotSize)) / 2
    this.tallyArray = []
    for (var i = 0; i < dotColors.length; i++) {
      var testDot = this.add.image(this.xOffset + this.Main.dotSize * i + this.Main.dotSize / 2, 1580, dotKey).setTint(dotColors[i])
      testDot.displayWidth = this.Main.spriteSize
      testDot.displayHeight = this.Main.spriteSize
      var tallyText = this.add.text(this.xOffset + this.Main.dotSize * i + this.Main.dotSize / 2, 1580 - this.Main.dotSize / 2, '0', { fontFamily: 'PixelFont', fontSize: '100px', color: '#F0B060', align: 'left' }).setOrigin(.5, 1)
      this.tallyArray.push(tallyText)
    }

  }

  update() {

  }



}