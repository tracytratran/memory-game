export function $(el) {
  return document.querySelector(el);
}

export function double(arr) {
  if (!arr) throw new Error("Invalid input!");

  const copiedArr = JSON.parse(JSON.stringify(arr));
  return [...arr, ...copiedArr];
}

export function shuffle(arr) {
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
