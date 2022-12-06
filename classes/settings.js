let gameOptions = {
  gemSize: 100,
  fallSpeed: 100,
  destroySpeed: 200,
  offsetX: 50,
  offsetY: 250,
  gameMode: 'time', //moves, challenge
  defaultTime: 60,



}


loadFont("PixelFont", "assets/fonts/mago1.ttf");
loadFont("PixelFontWide", "assets/fonts/mago3.ttf");
function loadFont(name, url) {
  var newFont = new FontFace(name, `url(${url})`);
  newFont.load().then(function (loaded) {
    document.fonts.add(loaded);
  }).catch(function (error) {
    return error;
  });
}
loadFont("PixelFontWide", "assets/fonts/mago3.ttf");

let dotKey = 'dot1'
let tally = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let dotAllColors = [0xDC5639, 0x823957, 0x436475, 0x5FA34C, 0xFBBD4E, 0xA6AB86];
let dotColors = []
let gameSettings;
var defaultValues = {
  mostDotsMoves: 0,
  mostDotsTime: 0,
  levelStatus: [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  totalSquares: 0,
  group: 0,
  currentLevel: 0
}

function sample(array) {
  var random = array[Math.floor(Math.random() * array.length)];
  return random;
}

function getLastElement(array) {
  return getLaterElements(array, 1);
}

function getSecondToLastElement(array) {
  return getLaterElements(array, 2);
}

function getLaterElements(array, index) {
  return array[array.length - index];
}

function deleteAt(array, index) {
  array.splice(index, 1);
}
function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

let colorGroups = [[0xDC5639, 0x823957, 0x436475, 0x5FA34C, 0xFBBD4E, 0xA6AB86],
[0xcb9831, 0x555220, 0x8f4a29, 0xcc4444, 0xe8c472, 0xf5fbef],
[0xe7d4be, 0x2b312e, 0x536b7b, 0x8d756b, 0xc3544b, 0xf4b675],
[0xfff2cc, 0xf4b675, 0x99a4ad, 0x7c7474, 0x916455, 0x758E4F],
[0x4da167, 0x61707d, 0x9d69a3, 0xf5fbef, 0xe85d75, 0xB87D4B],
[0x758E4F, 0x86BBD8, 0xF6AE2D, 0x33658A, 0xF26419, 0xA1869E]]
