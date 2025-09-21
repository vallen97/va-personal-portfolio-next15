export async function Swap(
  arr: Array<number>,
  a: number,
  b: number,
  sortingSpeed: number,
  drawArray: any,
  CHANGETHIS: Array<any>
) {
  // wait
  await sleep(sortingSpeed);
  // swaping process
  let temp: number = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
  // draw array values into canvas
  drawArray.clear(CHANGETHIS[2], CHANGETHIS[3]);
  drawArray.draw(
    CHANGETHIS[0],
    CHANGETHIS[1],
    CHANGETHIS[2],
    CHANGETHIS[3],
    CHANGETHIS[4]
  );
  return arr;
}

// set sleep timeout
async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
