const mainMenu = document.querySelector(".main-menu");
const gameArea = document.querySelector(".game-area");
const cardContainer = document.querySelector(".card-container");
const startButton = document.querySelector(".start-button");
const restartButton = document.querySelector(".restart-button");
const cards = document.querySelectorAll(".card");
let cardsData = [];

function init() {
  fetchCardsData().then((data) => {
    cardsData = data;
    renderCards();
  });
}

init();

async function fetchCardsData() {
  let data = await fetch("./cards.json");
  let results = await data.json();
  const shuffledCards = shuffle(double(results));
  return shuffledCards;
}

function renderCards() {
  cardContainer.innerHTML = "";

  cardsData.forEach((card, index) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.id = `card-${card.id}`;

    cardElement.innerHTML = `
                <div class="front-side"></div>
                <div class="back-side"><img src=${card.backside} alt=${`Backside image ${card.id}`} /></div>
            `;

    cardElement.addEventListener("click", () => {
      cardElement.classList.toggle("flipped");
    });

    cardContainer.appendChild(cardElement);
  });
}

startButton.addEventListener("click", () => {
  mainMenu.classList.toggle("hidden");
  gameArea.classList.toggle("hidden");
});

restartButton.addEventListener("click", () => {
  //   gameArea.classList.toggle("hidden");
  //   mainMenu.classList.toggle("hidden");
  cardContainer.innerHTML = "";
  init();
});

function double(arr) {
  const copiedArr = JSON.parse(JSON.stringify(arr));
  return [...arr, ...copiedArr];
}

function shuffle(arr) {
  const shuffledArr = [];
  const generatedIndex = {};
  let randomIndex;

  for (const el of arr) {
    do {
      randomIndex = Math.floor(Math.random() * arr.length);
    } while (generatedIndex[randomIndex]);

    generatedIndex[randomIndex] = true;
    shuffledArr[randomIndex] = el;
  }
  return shuffledArr;
}
