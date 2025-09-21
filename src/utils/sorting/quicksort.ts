import { Swap } from "../sorting/swap";

// Code from CodingTrain
// https://github.com/CodingTrain/website/blob/master/CodingChallenges/CC_143_QuickSort/P5/sketch.js
let sortingSpeed: number;
let isSorting: boolean = true;

export const QuickSort = () => {
  return {
    quick: async (
      arr: Array<number>,
      start: number,
      end: number,
      states: Array<number>,
      speed: number,
      drawArray: any,
      CHANGETHIS: Array<any>
    ) => {
      sortingSpeed = speed;
      let temp: any = quickSort(
        arr,
        start,
        end,
        states,
        sortingSpeed,
        drawArray,
        CHANGETHIS
      );
      arr = temp[0];
      states = temp[1];
      return [arr, states];
    },
    setSpeed: async (speed: number) => {
      sortingSpeed = speed;
    },
    setIsSorting: async (sorting: boolean) => {
      isSorting = sorting;
    },
  };
};

async function quickSort(
  arr: Array<number>,
  start: number,
  end: number,
  states: Array<number>,
  speed: number,
  drawArray: any,
  CHANGETHIS: Array<any>
) {
  if (isSorting == false) {
    return [arr, states];
  }
  sortingSpeed = speed;
  // if end is less than start
  if (start >= end) {
    // draw array values into canvas
    // drawArray(values, states);
    drawArray.clear(CHANGETHIS[2], CHANGETHIS[3]);
    drawArray.draw(
      CHANGETHIS[0],
      CHANGETHIS[1],
      CHANGETHIS[2],
      CHANGETHIS[3],
      CHANGETHIS[4]
    );
    return;
  }
  // start partition
  let index: number = await partition(
    arr,
    start,
    end,
    states,
    sortingSpeed,
    drawArray,
    CHANGETHIS
  );
  // set current index to normal
  states[index] = -1;
  // promise, await for completion
  await Promise.all([
    [
      quickSort(
        arr,
        start,
        index - 1,
        states,
        sortingSpeed,
        drawArray,
        CHANGETHIS
      ),
    ],
    [
      quickSort(
        arr,
        index + 1,
        end,
        states,
        sortingSpeed,
        drawArray,
        CHANGETHIS
      ),
    ],
  ]);
  return [arr, states];
}

async function partition(
  arr: Array<number>,
  start: number,
  end: number,
  states: any,
  speed: number,
  drawArray: any,
  CHANGETHIS: Array<any>
) {
  sortingSpeed = speed;
  // put i for comparison
  for (let i = start; i < end; i++) {
    states[i] = 1;
  }
  // pivot index start
  let pivotIndex: number = start;
  // values to end of array
  let pivotValue: number = arr[end];
  // color for comparing
  states[pivotIndex] = 0;
  // loop through start to end
  for (let i = start; i < end; i++) {
    // if arr is less than value
    if (arr[i] < pivotValue) {
      // swap
      //   await Swap(arr, i, pivotIndex, states);
      arr = await Swap(arr, i, pivotIndex, sortingSpeed, drawArray, CHANGETHIS);

      // reset color
      states[pivotIndex] = -1;
      pivotIndex++;
      // color for comparing
      states[pivotIndex] = 0;
    }
  }
  // swap
  //   await Swap(arr, pivotIndex, end, states);
  arr = await Swap(arr, pivotIndex, end, sortingSpeed, drawArray, CHANGETHIS);

  // loop from start to end
  for (let i = start; i < end; i++) {
    // if i is not index reset color
    if (i != pivotIndex) {
      states[i] = -1;
    }
  }
  // return index
  return pivotIndex;
}
