var paddleP1 = { x: 15, y: 150, width: 4, height: 50 };
var paddleP2 = { x: 785, y: 450, width: 4, height: 50 };
var gameCanvas = document.getElementById('game-canvas');
var context = gameCanvas.getContext('2d');
var winningScore = 10;
var ballSpeed = 2;
var paddleSpeed = 2.5;
var isResetting = false;
var scores = { p1: 0, p2: 0 };
var keys = {};
export var userInput = function () {
    document.addEventListener('keydown', function (e) {
        keys[e.key] = true;
    });
    document.addEventListener('keyup', function (e) {
        keys[e.key] = false;
    });
};
var randomDirection = function () { return Math.random() > 0.5 ? 1 : -1; };
var pass = function () { return (scores.p1 + scores.p2) % 2 === 0 ? -1 : 1; };
var gameOver = function () { return scores.p1 >= winningScore || scores.p2 >= winningScore; };
var ball = { x: 400, y: 300, radius: 4, dx: pass(), dy: randomDirection() };
var updateGame = function () {
    for (var key in keys) {
        if (keys[key]) {
            handleKey(key);
        }
    }
};
var updateScore = function (player, scores) {
    scores[player] += 1;
    isResetting = true;
    setTimeout(function () {
        ball = { x: 400, y: 300, radius: 4, dx: pass(), dy: randomDirection() };
        isResetting = false;
    }, 500);
};
var handleKey = function (key) {
    switch (key) {
        case 'ArrowUp':
            movePaddle(paddleP2, 'up');
            break;
        case 'ArrowDown':
            movePaddle(paddleP2, 'down');
            break;
        case 'w':
            movePaddle(paddleP1, 'up');
            break;
        case 's':
            movePaddle(paddleP1, 'down');
            break;
        default:
            break;
    }
};
var updateBall = function (ball, speed) {
    if (speed === void 0) { speed = ballSpeed; }
    if (isResetting) {
        return;
    }
    if (ball.y + ball.dy >= gameCanvas.height - ball.radius || ball.y + ball.dy <= 0 + ball.radius) {
        ball.dy *= -1;
    }
    if (detectCollisionWithPaddle(paddleP2, ball)) {
        ball.dx *= -1;
    }
    if (detectCollisionWithPaddle(paddleP1, ball)) {
        ball.dx *= -1;
    }
    if (ball.x + ball.radius < 0 || ball.x + ball.radius > gameCanvas.width) {
        if (ball.x + ball.radius < 0) {
            updateScore('p2', scores);
        }
        else {
            updateScore('p1', scores);
        }
    }
    ball.x += ball.dx * speed;
    ball.y += ball.dy * speed;
};
var movePaddle = function (paddle, direction, speed) {
    if (speed === void 0) { speed = paddleSpeed; }
    if (direction === 'up' && paddle.y > 0) {
        paddle.y -= speed;
    }
    if (direction === 'down' && paddle.y + paddle.height < gameCanvas.height) {
        paddle.y += speed;
    }
};
export var init = function () {
    scores = { p1: 0, p2: 0 };
    if (context) {
        context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        context.fillStyle = '#fff';
        context.font = '16px Arial';
        context.fillText('Press ENTER to play', 340, 300);
    }
};
var detectCollisionWithPaddle = function (paddle, ball) {
    var collision = false;
    if (ball.x + ball.radius >= paddle.x &&
        ball.x - ball.radius <= paddle.x + paddle.width &&
        ball.y + ball.radius >= paddle.y &&
        ball.y - ball.radius <= paddle.y + paddle.height) {
        collision = true;
    }
    return collision;
};
var draw = function () {
    if (context) {
        // Clear gamecanvas
        context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        context.fillStyle = '#fff';
        // Draw scoreboard
        context.font = '16px Arial';
        context.fillText("Player1: ".concat(scores.p1), 10, 20);
        context.fillText("Player2: ".concat(scores.p2), 715, 20);
        // Draw paddles
        context.fillRect(paddleP1.x, paddleP1.y, paddleP1.width, paddleP1.height);
        context.fillRect(paddleP2.x, paddleP2.y, paddleP2.width, paddleP2.height);
        // Draw ball
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
        context.fill();
    }
};
var drawWinningMessage = function (context) {
    if (context) {
        var message = '';
        scores.p1 === winningScore ? message = "PLAYER1 WINS" : message = "PLAYER2 WINS";
        context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        context.font = '32px Arial';
        context.fillText(message, (gameCanvas.width / 2 - 100), (gameCanvas.height / 2));
    }
};
export var gameLoop = function () {
    if (gameOver() === false) {
        updateGame();
        updateBall(ball, ballSpeed);
        draw();
        window.requestAnimationFrame(gameLoop);
    }
    else {
        drawWinningMessage(context);
        setTimeout(function () { return init(); }, 7000);
        return;
    }
};
