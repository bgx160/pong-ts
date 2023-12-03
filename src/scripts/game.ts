interface Paddle {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Ball {
    x: number;
    y: number;
    radius: number;
    dx: number;
    dy: number;
}



const paddleP1: Paddle = { x: 15, y: 150, width: 4, height: 50 };
const paddleP2: Paddle = { x: 785, y: 450, width: 4, height: 50 };

const gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const context: CanvasRenderingContext2D | null = gameCanvas.getContext('2d');

const winningScore: number = 10;
const ballSpeed: number = 2;
const paddleSpeed: number = 2.5;

let isResetting: boolean = false;
let scores: { p1: number, p2: number } = { p1: 0, p2: 0 };
let keys: Record<string, boolean> = {};

export const userInput = (): void => {
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
}

const randomDirection = (): number => Math.random() > 0.5 ? 1 : -1;

const pass = (): number => (scores.p1 + scores.p2) % 2 === 0 ? -1 : 1

const gameOver = (): boolean => scores.p1 >= winningScore || scores.p2 >= winningScore;

let ball: Ball = { x: 400, y: 300, radius: 4, dx: pass(), dy: randomDirection() };


const updateGame = (): void => {
    for (const key in keys) {
        if (keys[key]) {
            handleKey(key);
        }
    }
}

const updateScore = (player: 'p1' | 'p2', scores: { p1: number, p2: number }): void => {
    scores[player] += 1;
    isResetting = true;
    setTimeout(() => {
        ball = { x: 400, y: 300, radius: 4, dx: pass(), dy: randomDirection() };
        isResetting = false;
    }, 500);
}

const handleKey = (key: string): void => {
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
}

const updateBall = (ball: Ball, speed: number = ballSpeed): void => {
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
        } else {
            updateScore('p1', scores);
        }
    }

    ball.x += ball.dx * speed;
    ball.y += ball.dy * speed;
};

const movePaddle = (paddle: Paddle, direction: string, speed: number = paddleSpeed): void => {
    if (direction === 'up' && paddle.y > 0) {
        paddle.y -= speed;
    }
    if (direction === 'down' && paddle.y + paddle.height < gameCanvas.height) {
        paddle.y += speed;
    }
}

export const init = (): void => {
    scores = { p1: 0, p2: 0 };

    if (context) {
        context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        context.fillStyle = '#fff';
        context.font = '16px Arial';
        context.fillText('Press ENTER to play', 340, 300);
    }
}

const detectCollisionWithPaddle = (paddle: Paddle, ball: Ball): boolean => {
    let collision: boolean = false;

    if (
        ball.x + ball.radius >= paddle.x &&
        ball.x - ball.radius <= paddle.x + paddle.width &&
        ball.y + ball.radius >= paddle.y &&
        ball.y - ball.radius <= paddle.y + paddle.height
    ) {
        collision = true;
    }
    return collision;
}

const draw = (): void => {
    if (context) {

        // Clear gamecanvas
        context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        context.fillStyle = '#fff';

        // Draw scoreboard
        context.font = '16px Arial';
        context.fillText(`Player1: ${scores.p1}`, 10, 20)
        context.fillText(`Player2: ${scores.p2}`, 715, 20)

        // Draw paddles
        context.fillRect(paddleP1.x, paddleP1.y, paddleP1.width, paddleP1.height);
        context.fillRect(paddleP2.x, paddleP2.y, paddleP2.width, paddleP2.height);

        // Draw ball
        context.beginPath()
        context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
        context.fill();

    }
}

const drawWinningMessage = (context: CanvasRenderingContext2D | null) => {
    if (context) {
        let message: string = '';
        scores.p1 === winningScore ? message = "PLAYER1 WINS" : message = "PLAYER2 WINS"
        context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        context.font = '32px Arial';
        context.fillText(message, (gameCanvas.width / 2 - 100), (gameCanvas.height / 2));
    }
}

export const gameLoop = (): void => {
    if (gameOver() === false) {
        updateGame();
        updateBall(ball, ballSpeed);
        draw();
        window.requestAnimationFrame(gameLoop);
    } else {
        drawWinningMessage(context);
        setTimeout(() => init(), 7000);
        return;
    }
}