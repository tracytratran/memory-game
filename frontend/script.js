const mainMenu = document.querySelector(".main-menu");
const gameArea = document.querySelector(".game-area");
const cardContainer = document.querySelector(".card-container");
const startButton = document.querySelector(".start-button");
const restartButton = document.querySelector(".restart-button");
const counterEl = document.querySelector("#move-counter");
const timerEl = document.querySelector("#timer");
const cards = document.querySelectorAll(".card");
const winScreen = document.querySelector(".win-screen");

let cardsData = [];
let counter;
let timer;
let intervalID = null;
let timeoutID = null;

init();

startButton.addEventListener("click", () => {
  mainMenu.classList.toggle("hidden");
  gameArea.classList.toggle("hidden");

  cleanUp();
  cardContainer.innerHTML = "";
  init();
});

restartButton.addEventListener("click", () => {
  winScreen.classList.add("hidden");

  cleanUp();
  cardContainer.innerHTML = "";
  init();
});

function getSelectedLevel() {
  const selected = document.querySelector(".level:checked");
  return selected ? selected.value : "level-1";
}

function init() {
  cleanUp();

  counter = 0;
  counterEl.textContent = counter;
  timer = 60;
  timerEl.textContent = timer;

  fetchCardsData().then((data) => {
    cardsData = data;
    renderCards();
  });
}

function cleanUp() {
  clearTimeout(timeoutID);
  timeoutID = null;
  stopTimer();
  cardContainer.removeEventListener("click", handleCardClick);
  cardContainer.classList.remove("time-up");
}

async function fetchCardsData() {
  try {
    const level = getSelectedLevel();
    const response = await fetch(
      `http://localhost:8000/api/cards?category=${level}`,
    );
    const data = await response.json();

    const shuffledCards = shuffle(double(data));
    return shuffledCards;
  } catch (e) {
    console.log(e);
  }
}

function renderCards() {
  cardContainer.innerHTML = "";

  cardsData.forEach((card, index) => {
    // main div
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.id = `card-${index}`;

    // front side
    const cardFrontSideElement = document.createElement("div");
    cardFrontSideElement.classList.add("front-side");

    //frontside img
    const cardFrontSideImgElement = document.createElement("img");
    cardFrontSideImgElement.src =
      getSelectedLevel() === "level-2"
        ? "../assets/images/level-2-card-background.webp"
        : "../assets/images/frontside.jpg";
    cardFrontSideImgElement.alt = "Card front side";

    // back side
    const cardBackSideElement = document.createElement("div");
    cardBackSideElement.classList.add("back-side");

    //backside img
    const cardBackSideImgElement = document.createElement("img");
    cardBackSideImgElement.src = card.name;
    cardBackSideImgElement.alt = `Card backside ${index}`;

    // add images to the card
    cardFrontSideElement.appendChild(cardFrontSideImgElement);
    cardBackSideElement.appendChild(cardBackSideImgElement);

    //append sides to card
    cardElement.appendChild(cardFrontSideElement);
    cardElement.appendChild(cardBackSideElement);

    cardContainer.appendChild(cardElement);
  });

  // use grid wide when not level 1
  const level = getSelectedLevel();
  if (level != "level-1") {
    cardContainer.classList.add("grid-wide");
  }

  cardContainer.addEventListener("click", handleCardClick);
}

function handleCardClick(event) {
  const card = event.target.closest(".card");
  if (!card) return;

  const openCardIndexBeforeFlipping = getOpenCardsIndex();
  if (openCardIndexBeforeFlipping.length === 2) {
    return;
  }

  startTimer();

  if (!card.classList.contains("flipped")) {
    increaseCounter();
  }

  card.classList.toggle("flipped");
  const cardIndex = card.id.split("-")[1];
  cardsData[cardIndex].isOpen = !cardsData[cardIndex].isOpen;
  const openCardIndexAfterFlipping = getOpenCardsIndex();
  checkAndHideMatchedCards(openCardIndexAfterFlipping);
  closeUnmatchedCards(openCardIndexAfterFlipping);
}

function double(arr) {
  if (!arr) throw new Error("Invalid input!");

  const copiedArr = JSON.parse(JSON.stringify(arr));
  return [...arr, ...copiedArr];
}

function shuffle(arr) {
  if (!arr) throw new Error("Invalid input!");

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

function increaseCounter() {
  counter++;
  counterEl.textContent = counter;
}

function startTimer() {
  if (intervalID !== null) return;

  if (intervalID === null) {
    intervalID = setInterval(function () {
      timer--;
      timerEl.textContent = timer;
      checkLosingCondition();
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(intervalID);
  intervalID = null;
}

function checkLosingCondition() {
  if (timer === 0) {
    stopTimer();
    cardContainer?.classList.add("time-up");
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

function checkAndHideMatchedCards(openCardIndex) {
  if (
    openCardIndex.length === 2 &&
    cardsData[openCardIndex[0]].id === cardsData[openCardIndex[1]].id
  ) {
    setTimeout(() => {
      openCardIndex.forEach((index) => {
        document.querySelector(`#card-${index}`).classList.add("matched");
        cardsData[index].isOpen = false;
        cardsData[index].isMatched = true;
      });
      checkWinningCondition();
    }, 1000);
  }
}

function checkWinningCondition() {
  const matchedCards = cardsData.filter((card) => card.isMatched);

  if (matchedCards.length === cardsData.length) {
    clearInterval(intervalID);
    intervalID = null;

    winScreen.innerHTML = `
      <h1>🎉 You Win! 🎉</h1>
      <p class="win-stats">You finished in ${counter} moves</p>
      <p class="win-stats">Time taken: ${timer} seconds</p>
    `;

    winScreen.classList.remove("hidden");

    stopTimer();
  }
}

function closeUnmatchedCards(openCardIndex) {
  if (
    openCardIndex.length === 2 &&
    cardsData[openCardIndex[0]].id !== cardsData[openCardIndex[1]].id
  ) {
    setTimeout(function () {
      openCardIndex.forEach((index) => {
        document.querySelector(`#card-${index}`).classList.toggle("flipped");
        cardsData[index].isOpen = false;
      });
    }, 1000);
  }
}
