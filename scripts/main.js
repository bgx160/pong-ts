import { gameLoop, init, userInput } from "./game.js";
document.addEventListener("DOMContentLoaded", function () {
    init();
});
document.addEventListener("keydown", function (e) {
    e.preventDefault();
    if (e.key === 'Enter') {
        userInput();
        gameLoop();
    }
});
