class Board {
  constructor(width, height, scene) {
    if (width > 12 || width < 2) alert("Board size must be between 2 and 12");
    this.width = width;
    this.height = height
    this.columnSize = Math.floor(12 / width);
    this.dots = [];
    this.selectedColor = "not yet defined";
    this.selectedDots = [];
    this.dragging = false;
    this.redrawTheseColumns = {};
    this.blueScore = 0;
    this.greenScore = 0;
    this.purpleScore = 0;
    this.redScore = 0;
    this.yellowScore = 0;
    this.squareCompleted = false;
    this.scene = scene
  }

  makeBoard() {

    for (var xAxis = 0; xAxis < this.width; xAxis++) {
      this.makeColumn(xAxis);
    }
    // return html + htmlEnd;
  };

  makeColumn(xAxis) {

    var column = [];
    for (var yAxis = 0; yAxis < this.height; yAxis++) {
      var dot = this.makeDot(xAxis, yAxis);
      column.push(dot);

    }
    this.dots.push(column);

  };
  redrawColumns = function () {
    var board = this;
    for (var x in board.redrawTheseColumns) {
      var column = board.dots[x];
      // var newHTML = "";
      column.forEach(function (dot) {
        //  newHTML += dot.html();
      });
      //$("#column-" + x).html(newHTML);
    }
    //this.bounceDots();
  }
  makeDot(xAxis, yAxis) {
    var color = this.randomColor();
    var coordinates = [xAxis, yAxis];
    // console.log(coordinates)
    var dot = new Dot(coordinates, color, this, this.scene.dotSize);
    return dot;
  }
  createNewDot(x) {
    var dot = this.makeDot(x, 0);
    let posX = this.scene.xOffset + this.scene.dotSize * x + this.scene.dotSize / 2;
    let posY = this.scene.yOffset + this.scene.dotSize * 0 + this.scene.dotSize / 2
    var img = this.scene.add.image(posX, posY, dotKey).setTint(dotColors[dot.color])
    img.displayWidth = this.scene.spriteSize
    img.displayHeight = this.scene.spriteSize
    dot.image = img
    this.dots[x].unshift(dot);
  }
  deactivateLastDot() {
    var lastDot = getLastElement(this.selectedDots);
    lastDot.deactivate();
    this.selectedDots.pop();
  }
  destroyDots() {
    if (this.squareCompleted) {
      this.deleteAllDotsofColor();
    } else {
      this.deleteSelectedDots();
    }
    this.resetAfterDestroying();
  }
  deleteSelectedDots() {
    this.selectedDots.forEach(function (dot) {
      dot.explode();
    });
    this.selectedDots.forEach(function (dot) {
      dot.destroy();
    });
  }
  deleteAllDotsofColor() {
    var color = this.selectedColor;
    var dotsOfColor = this.findAllByColor(color);
    dotsOfColor.forEach(function (dot) {
      dot.explode();
    });
    dotsOfColor.forEach(function (dot) {
      dot.destroy();
    });
  }

  resetAfterDestroying() {
    this.selectedDots = [];
    this.selectedColor = "none";
    this.squareCompleted = false;
    this.redrawColumns();
    //  this.updateScore();
    // this.addListeners();
    //  $(".bounce").removeClass("bounce");
    this.redrawTheseColumns = {};
  }
  secondToLast(dot) {
    var secondToLastDot = getSecondToLastElement(this.selectedDots);
    return secondToLastDot == dot;
  }

  findDots(coords) {
    var foundDots = [];
    var board = this;
    coords.forEach(function (coordinates) {
      var found = board.findDot(coordinates);
      if (found) foundDots.push(found);
    });
    //console.log(foundDots)
    return foundDots;
  }
  findDot(coordinates) {
    //var x = col
    //var y = row
    var x = coordinates[0];
    var y = coordinates[1];
    if (this.validCoordinates(x, y)) {
      return this.dots[x][y];
    } else {
      return false;
    }
  }
  findAllByColor = function (color) {
    var container = [];
    this.dots.forEach(function (column) {
      column.forEach(function (dot) {
        if (dot.color == color) container.push(dot);
      });
    });
    return container;
  };
  activateSquare(dot) {
    this.selectedDots.push(dot);
    this.squareCompleted = true;
    this.scene.cameras.main.shake(50)
    var allColor = this.findAllByColor(this.selectedColor)
    //console.log(allColor.length)
    allColor.forEach(function (dot) {
      dot.image.setAlpha(.5)
    });
  }

  completeSquare(dot) {
    if (this.selectedDots.includes(dot)) {
      var tempDots = this.selectedDots;
      tempDots.push(dot);
      var index = tempDots.indexOf(dot);
      var circle = tempDots.slice(index, tempDots.length);
      console.log(circle)
      if (circle.length >= 5) return true;
    }
    return false;
  }
  validCoordinates = function (x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }
  randomColor() {
    var colors = Array.from(Array(this.scene.numColors).keys())
    if (this.squareCompleted) {
      var index = colors.indexOf(this.selectedColor);
      colors.splice(index, 1);
      return sample(colors);
    } else {
      return sample(colors);
    }
  }
  validDrag(dot) {
    return this.rightColor(dot) && this.isNeighbor(dot) && this.notAlreadySelected(dot) && this.canSelectDot(dot);
  }

  rightColor(dot) {
    return dot.color == this.selectedColor;
  }
  canSelectDot(dot) {
    return dot.selectable
  }
  isNeighbor(dot) {
    var neighbors = this.lastSelectedDot().neighbors();
    return neighbors.includes(dot);

  }

  notAlreadySelected(dot) {
    return !this.selectedDots.includes(dot);

  }

  sameDot = function (dotA, dotB) {
    return dotA.coordinates[0] == dotB.coordinates[0] && dotA.coordinates[1] == dotB.coordinates[1];
  }
  lastSelectedDot() {
    //console.log(getLastElement(this.selectedDots));
    return getLastElement(this.selectedDots);
  }
  secondToLastSelectedDot() {
    return getSecondToLastElement(this.selectedDots)
  }
  resetBoard() {
    this.selectedDots.forEach(function (dot) {
      dot.deactivate();
    });
    this.selectedDots = [];
    this.selectedColor = "none";
    this.redrawTheseColumns = {};
  }

}