//dont want alert for winner do it in canvas
// Constants
const boardHeight = 500;
const boardWidth = 800;
const paddleHeight = 65;
const paddleWidth = 10;
const ballRadius = 6.5;

// Initial Scores
let leftScore = 0;
let rightScore = 0;

// Canvas and Context
let board;
let context;

// Paddles
let leftPaddle = createPaddle(10, 220);
let rightPaddle = createPaddle(780, 220);

function createPaddle(x, y) {
  return {
    x: x,
    y: y,
    width: paddleWidth,
    height: paddleHeight,
    goUp: function () {
      let minY = 0;
      this.y = Math.max(this.y - 20, minY);
    },
    goDown: function () {
      let maxY = boardHeight - this.height;
      this.y = Math.min(this.y + 20, maxY);
    },
  };
}

// Ball
let ball = createBall(boardWidth / 2, boardHeight / 2, ballRadius, 5, 5);

function createBall(x, y, radius, xMove, yMove) {
  return {
    x: x,
    y: y,
    radius: radius,
    xMove: xMove,
    yMove: yMove,
  };
}

// Track pressed keys
let keysPressed = {};

// Initialization
window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  // Event Listeners for Paddle Controls
  document.addEventListener("keydown", function (event) {
    keysPressed[event.key] = true;
    handleKeyPress();
  });

  document.addEventListener("keyup", function (event) {
    delete keysPressed[event.key];
    handleKeyPress();
  });

  animate(); // Start animation loop
};

// Animation Loop
let lastTimestamp = 0;

function animate(timestamp) {
  const deltaTime = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  context.clearRect(0, 0, board.width, board.height);

  drawPaddle(leftPaddle);
  drawPaddle(rightPaddle);
  drawBall();

  moveBall(deltaTime);
  drawScoreboard();
  handleScoring();
  drawMiddleLine();

  handleCollisions();

  requestAnimationFrame(animate);
}

function moveBall(deltaTime) {
  ball.x += (ball.xMove * deltaTime) / 500; // Adjust for time elapsed
  ball.y += (ball.yMove * deltaTime) / 500; // Adjust for time elapsed
}

// Event Handler for Paddle Controls
function handleKeyPress() {
  // Left paddle controls (W and S keys)
  if (keysPressed["w"]) {
    leftPaddle.goUp();
  } else if (keysPressed["s"]) {
    leftPaddle.goDown();
  }

  // Right paddle controls (Up and Down arrow keys)
  if (keysPressed["ArrowUp"]) {
    rightPaddle.goUp();
  } else if (keysPressed["ArrowDown"]) {
    rightPaddle.goDown();
  }
}

// Drawing Functions
function drawPaddle(paddle) {
  context.fillStyle = "white";
  context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fillStyle = "white";
  context.fill();
  context.closePath();
}

function drawScoreboard() {
  context.fillStyle = "white";
  context.font = "20px Helvetica";
  context.fillText("Player 1: " + leftScore, 160, 30);
  context.fillText("Player 2: " + rightScore, boardWidth - 250, 30);
}

function drawMiddleLine() {
  context.setLineDash([15, 8]); // Set dash pattern (5px dash, 10px gap)
  context.lineWidth = 5; // Adjust line width to match dash length
  context.strokeStyle = "white"; // Set line color
  context.beginPath();
  context.moveTo(boardWidth / 2, 0);
  context.lineTo(boardWidth / 2, boardHeight);
  context.stroke();
}

// Ball Movement and Collision Handling
function moveBall() {
  ball.x += ball.xMove;
  ball.y += ball.yMove;
}

function bounceBallY() {
  ball.yMove *= -1;
}

function bounceBallX() {
  ball.xMove *= -1;
}

function resetBallPosition() {
  ball.x = boardWidth / 2;
  ball.y = boardHeight / 2;
}

function handleCollisions() {
  if (ball.y + ball.radius > boardHeight || ball.y - ball.radius < 0) {
    bounceBallY();
  }
  handlePaddleCollisions();
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > boardWidth) {
    resetBallPosition();
  }
}

function isBallCollidingWithPaddle(paddle) {
  return (
    ball.x + ball.radius > paddle.x &&
    ball.x - ball.radius < paddle.x + paddle.width &&
    ball.y + ball.radius > paddle.y &&
    ball.y - ball.radius < paddle.y + paddle.height
  );
}

function handlePaddleCollisions() {
  if (
    isBallCollidingWithPaddle(rightPaddle) ||
    isBallCollidingWithPaddle(leftPaddle)
  ) {
    bounceBallX();
  }
}

function handleScoring() {
  if (ball.x - ball.radius < 0) {
    rightScore++;
    checkWinner();
  } else if (ball.x + ball.radius > boardWidth) {
    leftScore++;
    checkWinner();
  }
}

function checkWinner() {
  if (leftScore === 10) {
    alert("Player 1 is the winner!");
    resetGame();
  } else if (rightScore === 10) {
    alert("Player 2 is the winner!");
    resetGame();
  }
}

function resetGame() {
  leftScore = 0;
  rightScore = 0;
  resetBallPosition();
}
