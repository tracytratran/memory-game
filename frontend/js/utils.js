export function getEl(el) {
  return document.querySelector(el);
}

export function createEl(el) {
  return document.createElement(el);
}

export function double(arr) {
  if (!arr) throw new Error("Invalid input!");

  const copiedArr = JSON.parse(JSON.stringify(arr));
  return [...arr, ...copiedArr];
}

export function shuffle(arr) {
  if (!arr) throw new Error("Invalid input!");

  const shuffledArr = arr
    .map(function (card) {
      card.randomID = Math.random();
      return card;
    })
    .toSorted(function (a, b) {
      return a.randomID > b.randomID ? 1 : -1;
    })
    .map(function (card) {
      delete card.randomID;
      return card;
    });
  return shuffledArr;
}
