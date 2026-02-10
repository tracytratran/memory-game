const mainMenu = document.querySelector(".main-menu");
const gameArea = document.querySelector(".game-area");
const cardContainer = document.querySelector(".card-container");
const startButton = document.querySelector(".start-button");
const restartButton = document.querySelector(".restart-button");
const counterEl = document.querySelector("#move-counter");
const timerEl = document.querySelector("#timer");
const cards = document.querySelectorAll(".card");
let cardsData = [];
let counter = 0;
let timer = 0;
let intervalID, timeoutID;

function init() {
  clearInterval(intervalID);
  // clearTimeout(timeoutID);
  counter = 0;
  counterEl.textContent = counter;
  timer = 0;
  timerEl.textContent = timer;
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
    cardElement.id = `card-${index}`;

    cardElement.innerHTML = `
                <div class="front-side"><img src="./frontside.jpg" alt="Frontside image" /></div>
                <div class="back-side"><img src=${card.backside} alt=${`Backside image ${card.id}`} /></div>
            `;

    cardElement.addEventListener("click", () => {
      if (timer === 0) {
        intervalID = setInterval(function () {
          timerEl.textContent = timer + 1;
          timer++;
        }, 1000);
      }

      cardElement.classList.toggle("flipped");

      if (!cardsData[index].isOpen) {
        counter++;
      }
      counterEl.textContent = counter;

      cardsData[index].isOpen = !cardsData[index].isOpen;

      const openedCardIndex = [];
      cardsData.forEach((card, index) => {
        if (card.isOpen) {
          openedCardIndex.push(index);
        }
      });
      if (openedCardIndex.length === 2) {
        timeoutID = setTimeout(function () {
          openedCardIndex.forEach((index) => {
            document
              .querySelector(`#card-${index}`)
              .classList.toggle("flipped");
            cardsData[index].isOpen = false;
          });
          clearTimeout(timeoutID);
        }, 2000);
      }
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
