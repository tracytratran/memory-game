const mainMenu = document.querySelector(".main-menu")
const gameArea = document.querySelector(".game-area")
const startButton = document.querySelector(".start-button")
const restartButton = document.querySelector(".restart-button")


startButton.addEventListener("click", () => {
    mainMenu.classList.toggle("hidden")
    gameArea.classList.toggle("hidden")
})

restartButton.addEventListener('click', () =>{
    gameArea.classList.toggle("hidden")
     mainMenu.classList.toggle("hidden")

})