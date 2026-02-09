const mainMenu = document.querySelector(".main-menu")
const gameArea = document.querySelector(".game-area")
const cardContainer = document.querySelector(".card-container")
const startButton = document.querySelector(".start-button")
const restartButton = document.querySelector(".restart-button")
const cards = document.querySelectorAll(".card");

async function fetchCards() {
    let data = await fetch("./cards.json");
    let results = await data.json();
    if (results) {
        results.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add("card")

            cardElement.innerHTML = `
                <div class="front-side">${card.frontside}</div>
                <div class="back-side">${card.backside}</div>
            `;

            cardElement.addEventListener("click", () => {
                cardElement.classList.toggle("flipped");
            });

            cardContainer.appendChild(cardElement)
        })
    }
}

fetchCards();

startButton.addEventListener("click", () => {
    mainMenu.classList.toggle("hidden")
    gameArea.classList.toggle("hidden")
})

restartButton.addEventListener('click', () => {
    gameArea.classList.toggle("hidden")
    mainMenu.classList.toggle("hidden")

})