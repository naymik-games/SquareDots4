class Dot {
  constructor(coordinates, color, board, dotSize) {
    this.coordinates = coordinates;
    this.color = color;
    this.board = board;
    this.disabled = false;
    this.bounce = false
    this.image = null
    this.dotSize = dotSize
    this.selectable = true
    /* if (this.color == 2) {
      this.selectable = false
    } else {
      this.selectable = true
    } */


  }
  activate() {
    //var visibleDot = this.findDOMObject();
    //visibleDot.addClass("active");
    this.board.selectedColor = this.color;
    this.board.selectedDots.push(this);
    this.image.setAlpha(.5)
  }

  deactivate() {
    // var visibleDot = this.findDOMObject();
    //visibleDot.removeClass("active");
    this.image.setAlpha(1)
  }
  explode = function () {
    /*  var domDot = this.findDOMObject();
     var icon = domDot.children().first()
     icon.effect("explode", { pieces: 16 }); */
    this.image.destroy()
  }
  destroy(dotSize) {
    this.disabled = true;
    // eval("this.board." + this.color + "Score += 1");
    tally[this.color]++
    this.redrawThisColumn();
    this.adjustAboveDotCoordinates(dotSize);
    this.deleteThisFromArray();
    this.fillInSpaceLeft();
  };
  redrawThisColumn() {
    var x = this.coordinates[0];
    var y = this.coordinates[1];
    if (!(x in this.board.redrawTheseColumns) || this.board.redrawTheseColumns[x] < y) {
      this.board.redrawTheseColumns[x] = y;
    }
  }
  aboveDot() {
    var aboveCoords = this.aboveCoordinate();
    return this.board.findDot(aboveCoords);
  }

  aboveCoordinate() {
    return [this.coordinates[0], (this.coordinates[1] - 1)]
  }
  adjustAboveDotCoordinates() {
    this.aboveDots().forEach(function (dot) {
      dot.coordinates[1] += 1;
      dot.image.y += dot.dotSize
      //dot.image.y += 110
    });
  }
  deleteThisFromArray() {
    var x = this.coordinates[0];
    var y = this.coordinates[1];
    deleteAt(this.column(), y);
  }
  aboveDots() {
    var columnDots = this.column();
    var y = this.coordinates[1];
    return columnDots.filter(function (dot) {
      return dot.coordinates[1] < y;
    });
  }
  column() {
    var x = this.coordinates[0];
    return this.board.dots[x];
  }
  fillInSpaceLeft = function () {
    var x = this.coordinates[0];
    this.board.createNewDot(x);
  }
  neighbors() {
    var coords = this.neighborCoordinates();
    return this.board.findDots(coords);
  }

  neighborCoordinates() {
    var x = this.coordinates[0];
    var y = this.coordinates[1];
    return [
      [x, y - 1],
      [x, y + 1],
      [x - 1, y],
      [x + 1, y]
    ];
  }

  aboveDot() {
    var aboveCoords = this.aboveCoordinate();
    return this.board.findDot(aboveCoords);
  }

  aboveCoordinate() {
    return [this.coordinates[0], (this.coordinates[1] - 1)]
  }
}