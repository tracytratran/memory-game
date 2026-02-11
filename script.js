const mainMenu = document.querySelector(".main-menu")
const gameArea = document.querySelector(".game-area")
const startButton = document.querySelector(".start-button")
const restartButton = document.querySelector(".restart-button")
const cards = document.querySelectorAll(".card");

startButton.addEventListener("click", () => {
    mainMenu.classList.toggle("hidden")
    gameArea.classList.toggle("hidden")
})

restartButton.addEventListener('click', () =>{
    gameArea.classList.toggle("hidden")
     mainMenu.classList.toggle("hidden")

})

cards.forEach(card => {
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });
});