let currentScore = 0;
let highScore = 0;
let board;
let context;
let block = 25;
let rows = 20;
let cols = 20;
let boardHeight;
let boardWidth;

window.onload = function () {
  board = document.getElementById("board");
  board.height = rows * block;
  boardHeight = board.height;
  board.width = rows * block;
  boardWidth = board.width;
  context = board.getContext("2d"); //draw board

  drawSnake();
  drawScoreboard();
};

function drawScoreboard() {
  context.fillStyle = "white";
  context.font = "20px Helvetica";
  context.fillText("Current Score: " + currentScore, 50, 30);
  context.fillText("High Score: " + highScore, board.width - 190, 30);
}

function drawSnake() {
  context.fillStyle = "White";
  context.fillRect(boardHeight / 2, boardWidth / 2, 15, 15);
}
