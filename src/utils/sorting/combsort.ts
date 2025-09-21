import { Swap } from "../sorting/swap";

let sortingSpeed: number;
let isSorting: boolean = true;

export const CombSort = () => {
  return {
    comb: async (
      arr: Array<number>,
      states: any,
      ss: number,
      drawArray: any,
      CHANGETHIS: Array<any>
    ) => {
      sortingSpeed = ss;
      // array length
      let n: number = arr.length;
      // array length
      let gap: number = n;
      // if swapped
      let swapped: boolean = true;
      // if gap is not equal to 1
      loop1: while (gap != 1) {
        // get next gap
        gap = getNextGap(gap);
        // currently not swapped
        swapped = false;
        // i to array length - gap
        for (let i = 0; i < n - gap; i++) {
          if (isSorting == false) {
            break loop1;
          }
          // color for comparing
          states[i] = 0;
          // color being compared
          states[i + gap] = 1;
          if (arr[i] > arr[i + gap]) {
            // swap
            // await swap(arr, i, i + gap, states);
            arr = await Swap(
              arr,
              i,
              i + gap,
              sortingSpeed,
              drawArray,
              CHANGETHIS
            );

            // set swap
            swapped = true;
          }
          // reset colors
          states[i] = -1;
          states[i + gap] = -1;
        }
        // if not swapped
        if (swapped == false) {
          // break out of while loop
          break;
        }
      }
      // reset colors when finished
      for (let i = 0; i < states.length; i++) {
        states[i] = -1;
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
      }
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

function getNextGap(gap: number) {
  // gap is total size of array / 1.3 and round down
  gap = Math.floor((gap * 10) / 13);
  // if gap is less than 1
  if (gap < 1) {
    return 1;
  } else {
    return gap;
  }
}
