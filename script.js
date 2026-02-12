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
  try {
    let data = await fetch("./cards.json");
    let results = await data.json();
    const shuffledCards = shuffle(double(results));
    return shuffledCards;
  } catch (e) {
    console.log(e);
  }
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
      const openedCards = cardsData.filter((card) => card.isOpen);
      if (openedCards.length === 2) {
        return;
      }

      maybeStartTimer();

      cardElement.classList.toggle("flipped");

      maybeIncreaseCounter(index);

      cardsData[index].isOpen = !cardsData[index].isOpen;

      const openCardIndex = getOpenCardsIndex();

      closeUnmatchedCards(openCardIndex);

      checkAndHideMatchedCards(openCardIndex);
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

function maybeIncreaseCounter(index) {
  if (!cardsData[index].isOpen) {
    counter++;
  }
  counterEl.textContent = counter;
}

function maybeStartTimer() {
  if (timer === 0) {
    intervalID = setInterval(function () {
      timerEl.textContent = timer + 1;
      timer++;
    }, 1000);
  }
}

function getOpenCardsIndex() {
  const openCardIndex = [];
  cardsData.forEach((card, index) => {
    if (card.isOpen) {
      openCardIndex.push(index);
    }
  });
  return openCardIndex;
}

function closeUnmatchedCards(openCardIndex) {
  if (
    openCardIndex.length === 2 &&
    cardsData[openCardIndex[0]].id !== cardsData[openCardIndex[1]].id
  ) {
    timeoutID = setTimeout(function () {
      openCardIndex.forEach((index) => {
        document.querySelector(`#card-${index}`).classList.toggle("flipped");
        cardsData[index].isOpen = false;
      });
      clearTimeout(timeoutID);
    }, 1500);
  }
}
