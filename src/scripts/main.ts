import { gameLoop, init, userInput } from "./game.js";


document.addEventListener("DOMContentLoaded", () => {
    init();
});

document.addEventListener("keydown", (e) => {
    e.preventDefault();
    if (e.key === 'Enter') {
        userInput();
        gameLoop();
    }
})