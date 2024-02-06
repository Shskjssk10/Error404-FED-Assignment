//Snake Food 
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodXCoords, foodYCoords;
let snakeXCoords = 16, snakeYCoords = 16;
let snakeVelocityX = 0, snakeVelocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`;

const changeFoodPosition = () => {
    foodXCoords = Math.floor(Math.random() * 29) + 1;
    foodYCoords = Math.floor(Math.random() * 31) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game over! Press OK to replay!");
    location.reload();
}

const changeDirection = (e) => {
    if ((e.key === "ArrowUp" || e.key ==="w") && snakeVelocityY !== 1){
        snakeVelocityX = 0;
        snakeVelocityY = -1;
    } else if ((e.key === "ArrowDown" || e.key === "s") && snakeVelocityY !== -1){
        snakeVelocityX = 0;
        snakeVelocityY = 1;
    } else if ((e.key === "ArrowRight" || e.key === "d") && snakeVelocityX !== -1){
        snakeVelocityX = 1;
        snakeVelocityY = 0;
    } else if ((e.key === "ArrowLeft" || e.key === "a") && snakeVelocityX !== 1){
        snakeVelocityX = -1;
        snakeVelocityY = 0;
    }
    initGame();
}

controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({key : key.dataset.key}))
})

const initGame = () => {
    if (gameOver) return handleGameOver();

    let htmlMarkup = `<div class="food" style="grid-area: ${foodYCoords} / ${foodXCoords}"></div>`;
    htmlMarkup += `<div class="snake" style="grid-area: ${snakeYCoords} / ${snakeXCoords}"></div>`;

    // Checks to see if the snake has hit the food
    if (snakeXCoords === foodXCoords && snakeYCoords === foodYCoords){
        changeFoodPosition();
        snakeBody.push([foodXCoords, foodYCoords]); //Pushes food position to snake's body.
        score++;
        highScore = score > highScore ? score : highScore;

        scoreElement.innerHTML = `Score: ${score}`;
        localStorage.setItem("high-score", highScore);
        highScoreElement.innerHTML = `High Score: ${highScore}`
    }

    for (let i = snakeBody.length -1; i > 0; i--){
        // Shifts the values of elements in snake body by one forward
        snakeBody[i] = snakeBody[i-1];
    }

    snakeBody[0] = [snakeXCoords, snakeYCoords];

    // Updates snake's direction
    snakeXCoords += snakeVelocityX;
    snakeYCoords += snakeVelocityY;

    if (snakeXCoords <= 0 || snakeXCoords > 29 || snakeYCoords <= 0 || snakeYCoords > 31){
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++){
        // Adds a div for each part of the snake's body.
        htmlMarkup += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Checks if snake hits its own body
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection)