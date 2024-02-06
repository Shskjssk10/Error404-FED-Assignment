const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const coverPrompt = document.querySelector(".cover");
const submitButton = document.querySelector(".submit-button");

let gameOver = false;
let foodXCoords, foodYCoords;
let snakeXCoords = 16, snakeYCoords = 16;
let snakeVelocityX = 0, snakeVelocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`;

let usernameSubmitted = false;

const changeFoodPosition = () => {
    foodXCoords = Math.floor(Math.random() * 31) + 1;
    foodYCoords = Math.floor(Math.random() * 29) + 1;
}

const handleGameOver = () => {
    if (!gameOver) {
        gameOver = true;
        alert("Game over! Press OK to replay!");
        clearInterval(setIntervalId);
        resetGame();
        startGame();
        gameOver = false;
    }
}

const changeDirection = (e) => {
    if (gameOver || !usernameSubmitted) {
        return;
    }

    if ((e.key === "ArrowUp" || e.key === "w") && snakeVelocityY !== 1) {
        snakeVelocityX = 0;
        snakeVelocityY = -1;
    } else if ((e.key === "ArrowDown" || e.key === "s") && snakeVelocityY !== -1) {
        snakeVelocityX = 0;
        snakeVelocityY = 1;
    } else if ((e.key === "ArrowRight" || e.key === "d") && snakeVelocityX !== -1) {
        snakeVelocityX = 1;
        snakeVelocityY = 0;
    } else if ((e.key === "ArrowLeft" || e.key === "a") && snakeVelocityX !== 1) {
        snakeVelocityX = -1;
        snakeVelocityY = 0;
    }
}

controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }))
})

const resetGame = () => {
    snakeXCoords = 16;
    snakeYCoords = 16;
    snakeVelocityX = 0;
    snakeVelocityY = 0;
    snakeBody = [];
    score = 0;
    changeFoodPosition();
    updateScoreDisplay();
}

const updateScoreDisplay = () => {
    scoreElement.innerHTML = `Score: ${score}`;
    localStorage.setItem("high-score", highScore);
    highScoreElement.innerHTML = `High Score: ${highScore}`;
}

const startGame = () => {
    setIntervalId = setInterval(initGame, 125);
}

const initGame = () => {
    if (gameOver) return handleGameOver();

    let htmlMarkup = `<div class="food" style="grid-area: ${foodYCoords} / ${foodXCoords}"></div>`;
    htmlMarkup += `<div class="snake" style="grid-area: ${snakeYCoords} / ${snakeXCoords}"></div>`;

    if (snakeXCoords === foodXCoords && snakeYCoords === foodYCoords) {
        changeFoodPosition();
        snakeBody.push([foodXCoords, foodYCoords]);
        score++;
        highScore = score > highScore ? score : highScore;

        updateScoreDisplay();
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeXCoords, snakeYCoords];

    snakeXCoords += snakeVelocityX;
    snakeYCoords += snakeVelocityY;

    if (snakeXCoords <= 0 || snakeXCoords > 31 || snakeYCoords <= 0 || snakeYCoords > 29) {
        handleGameOver();
    }

    for (let i = 0; i < snakeBody.length; i++) {
        htmlMarkup += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            handleGameOver();
        }
    }
    playBoard.innerHTML = htmlMarkup;
}

const handleCoverDisappearance = () => {
    usernameSubmitted = true;
    coverPrompt.style.display = "none";
    resetGame();
    startGame();
}

submitButton.addEventListener("click", () => {
    handleCoverDisappearance();
});

document.addEventListener("keydown", (e) => {
    if (!usernameSubmitted && e.key === "Enter") {
        handleCoverDisappearance();
    }
});

changeFoodPosition();
startGame();
document.addEventListener("keydown", changeDirection);
