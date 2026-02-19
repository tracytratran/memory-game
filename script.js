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
let intervalID = null;
let timeoutID = null;

init();

startButton.addEventListener("click", () => {
  mainMenu.classList.toggle("hidden");
  gameArea.classList.toggle("hidden");
});

restartButton.addEventListener("click", () => {
  cleanUp();
  cardContainer.innerHTML = "";
  init();
});

function init() {
  cleanUp();
  counter = 0;
  counterEl.textContent = counter;
  timer = 0;
  timerEl.textContent = timer;
  //fetch card data and render then
  fetchCardsData().then((data) => {
    cardsData = data;
    renderCards();
  });
}

function cleanUp() {
  clearInterval(intervalID);
  clearTimeout(timeoutID);
  intervalID = null;
  timeoutID = null;
  cardContainer.removeEventListener("click", handleCardClick);
}

// ==========================
// FETCH CARD DATA
// ==========================

async function fetchCardsData() {
  try {
    let data = await fetch("./cards.json");
    let results = await data.json();

    const shuffledCards = shuffle(double(results));
    return shuffledCards;
  } catch (e) {
    // TO-DO: stop implementing further and give player alert
    // Try to re-fetch the data
    // After X times, can return an error
    console.log(e);
  }
}

// ==========================
// RENDER CARDS TO DOM
// ==========================

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
    cardFrontSideImgElement.src = "./frontside.jpg";
    cardFrontSideImgElement.alt = "Card front side";

    // back side
    const cardBackSideElement = document.createElement("div");
    cardBackSideElement.classList.add("back-side");
    //backside img
    const cardBackSideImgElement = document.createElement("img");
    cardBackSideImgElement.src = card.backside;
    cardBackSideImgElement.alt = `Card backside ${index}`;

    // add images to the card
    cardFrontSideElement.appendChild(cardFrontSideImgElement);
    cardBackSideElement.appendChild(cardBackSideImgElement);

    //append sides to card
    cardElement.appendChild(cardFrontSideElement);
    cardElement.appendChild(cardBackSideElement);

    // ==========================
    // CARD CLICK LOGIC
    // ==========================

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

    //add card to cardcontainer
    cardContainer.appendChild(cardElement);
  });

  cardContainer?.addEventListener("click", handleCardClick);
}

// ==========================
// BUTTON EVENTS
// ==========================

//start game (hide menu, show game)
startButton.addEventListener("click", () => {
  mainMenu.classList.toggle("hidden");
  gameArea.classList.toggle("hidden");
});

//reset game
restartButton.addEventListener("click", () => {
  cardContainer.innerHTML = "";
  init();
});
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
  // checkIfTwoCardsMatch(openCardIndexAfterFlipping);
}

// ==========================
// HELPER FUNCTIONS
// ==========================

//duplicate the array so we have pairs
function double(arr) {
  if (!arr) throw new Error("Invalid input!");

  const copiedArr = JSON.parse(JSON.stringify(arr));
  return [...arr, ...copiedArr];
}
//shuffle cards randomly
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
//increase move counter only when opening new card
function maybeIncreaseCounter(index) {
  if (!cardsData[index].isOpen) {
    counter++;
  }
  counterEl.textContent = counter;
}
//start timer on first card click
function maybeStartTimer() {
  if (timer === 0) {
    intervalID = setInterval(function () {
      timer++;
      timerEl.textContent = timer;
    }, 1000);
  }
}
//get indexes of all currently opened cards

function increaseCounter() {
  counter++;
  counterEl.textContent = counter;
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

//hide cards uf they match
function checkAndHideMatchedCards(openCardIndex) {
  if (
    openCardIndex.length === 2 &&
    cardsData[openCardIndex[0]].id === cardsData[openCardIndex[1]].id
  ) {

    // For player to have time viewing matched cards
    setTimeout(() => {
      openCardIndex.forEach((index) => {
        const card = document.querySelector(`#card-${index}`);

        //add the flash effect
        card.classList.add("matched");
        setTimeout(() => {
          card.classList.add("visibility-hidden");
          card.classList.remove("matched");
        }, 600)
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
    console.log("You win!");
  }
}

//close cards if they are not matching
function closeUnmatchedCards(openCardIndex) {
  if (
    openCardIndex.length === 2 &&
    cardsData[openCardIndex[0]].id !== cardsData[openCardIndex[1]].id
  ) {
    timeoutID = setTimeout(function () {
      openCardIndex.forEach((index) => {
        const card = document.querySelector(`#card-${index}`);

        //add red flash
        card.classList.add("unmatched");

        //animation
        setTimeout(() => {
          card.classList.remove("unmatched");
          card.classList.toggle("flipped");
          cardsData[index].isOpen = false;
        }, 500)
      });
      clearTimeout(timeoutID);
    }, 1500);
  }
}
