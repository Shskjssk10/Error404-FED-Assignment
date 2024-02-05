let currentScore = 0;
let highScore = 0;
let board;
let context;
let block = 18;
let rows = 20;
let cols = 20;
let boardHeight;
let boardWidth;
let snake;
let snakeSize = 15; // New variable for snake size
let foodSize = 15; // New variable for food size

// Function to get a random coordinate within a specified range
function RandomXY(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function to initialize the game
window.onload = function () {
  // Get the canvas and set its dimensions
  board = document.getElementById("board");
  board.height = 500;
  boardHeight = board.height;
  board.width = 500;
  boardWidth = board.width;
  context = board.getContext("2d");

  // Create the snake
  snake = new Snake(
    Math.floor(boardWidth / (2 * block)),
    Math.floor(boardHeight / (2 * block))
  );

  // Event listeners for arrow keys and WASD
  document.addEventListener("keydown", handleKeyPress);

  // Start the game loop
  setInterval(draw, 150); // Adjust the delay here
};

// Function to handle key presses
function handleKeyPress(e) {
  switch (e.key) {
    case "ArrowUp":
    case "w":
      snake.changeDirection("UP");
      break;
    case "ArrowDown":
    case "s":
      snake.changeDirection("DOWN");
      break;
    case "ArrowLeft":
    case "a":
      snake.changeDirection("LEFT");
      break;
    case "ArrowRight":
    case "d":
      snake.changeDirection("RIGHT");
      break;
  }
}

// Function to draw the game state
function draw() {
  // Clear the canvas
  context.clearRect(0, 0, boardWidth, boardHeight);

  // Draw snake
  snake.move();
  for (let i = 0; i < snake.segments.length; i++) {
    context.fillStyle = "white";
    context.strokeStyle = "white"; // Border color
    context.lineWidth = 2; // Border width
    context.fillRect(
      snake.segments[i].x * block,
      snake.segments[i].y * block,
      block,
      block
    );
    context.strokeRect(
      snake.segments[i].x * block,
      snake.segments[i].y * block,
      block,
      block
    );
  }

  // Draw food
  drawFood();

  // Draw scoreboard
  drawScoreboard();
}

// Function to draw the scoreboard
function drawScoreboard() {
  context.fillStyle = "white";
  context.font = "20px Helvetica";
  context.fillText("Current Score: " + currentScore, 50, 30);
  context.fillText("High Score: " + highScore, board.width - 190, 30);
}

// Function to draw the food
function drawFood() {
  context.fillStyle = "red";
  context.fillRect(snake.foodX * block, snake.foodY * block, block, block);
}

// Snake class
class Snake {
  constructor(x, y) {
    this.segments = [{ x: x, y: y }];
    this.direction = "RIGHT";
    this.foodX = RandomXY(0, boardWidth / block - 1);
    this.foodY = RandomXY(0, boardHeight / block - 1);
  }

  // Function to change the direction of the snake
  changeDirection(newDirection) {
    if (
      (newDirection === "UP" && this.direction !== "DOWN") ||
      (newDirection === "DOWN" && this.direction !== "UP") ||
      (newDirection === "LEFT" && this.direction !== "RIGHT") ||
      (newDirection === "RIGHT" && this.direction !== "LEFT")
    ) {
      this.direction = newDirection;
    }
  }

  // Function to move the snake
  move() {
    let newHead = { x: this.segments[0].x, y: this.segments[0].y };

    if (currentScore > highScore) {
      highScore = currentScore;
    }

    // Move the head
    switch (this.direction) {
      case "UP":
        newHead.y -= 1;
        break;
      case "DOWN":
        newHead.y += 1;
        break;
      case "LEFT":
        newHead.x -= 1;
        break;
      case "RIGHT":
        newHead.x += 1;
        break;
    }

    // Check for collision with own tail
    for (let i = 1; i < this.segments.length; i++) {
      if (
        newHead.x === this.segments[i].x &&
        newHead.y === this.segments[i].y
      ) {
        // Snake collided with its own tail, reset the game
        currentScore = 0;
        this.segments = [
          {
            x: Math.floor(boardWidth / (2 * block)),
            y: Math.floor(boardHeight / (2 * block)),
          },
        ];
        return; // Exit the function to prevent further execution
      }
    }

    // Check for collision with food
    if (newHead.x === this.foodX && newHead.y === this.foodY) {
      // Snake ate the food
      currentScore++;

      // Move the food to a new random location
      this.foodX = Math.floor(RandomXY(0, boardWidth / block - 1));
      this.foodY = Math.floor(RandomXY(0, boardHeight / block - 1));

      // Add a new segment to the front of the snake
      this.segments.unshift(newHead);
    } else {
      // Remove the tail segment
      this.segments.pop();
      // Add the new head segment to the front
      this.segments.unshift(newHead);
    }

    // Check for collision with canvas boundaries
    if (
      newHead.x < 0 ||
      newHead.x >= boardWidth / block ||
      newHead.y < 0 ||
      newHead.y >= boardHeight / block
    ) {
      // Snake collided with the boundaries, reset the game
      currentScore = 0;
      this.segments = [
        {
          x: Math.floor(boardWidth / (2 * block)),
          y: Math.floor(boardHeight / (2 * block)),
        },
      ];
    }
  }
}
