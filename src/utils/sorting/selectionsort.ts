import { Swap } from "../sorting/swap";
let sortingSpeed: number;
let isSorting: boolean = true;

// Selection Sort
export const SelectionSort = () => {
  return {
    select: async (
      arr: Array<number>,
      states: Array<number>,
      speed: number,
      drawArray: any,
      CHANGETHIS: Array<any>
    ) => {
      sortingSpeed = speed;
      // loop through array length
      loop1: for (let i = 0; i < arr.length; i++) {
        // smallest index
        let min_idx: number = i;
        // loop through array again but one more than i
        for (let j = i + 1; j < arr.length; j++) {
          if (isSorting == false) {
            break loop1;
          }
          // number comparing, colorized
          states[i] = 0;
          // if array index is bigger change smallest number
          if (arr[min_idx] > arr[j]) {
            min_idx = j;
          }
        }
        // number being compared
        states[min_idx] = 1;
        // swap numbers
        arr = await Swap(arr, i, min_idx, sortingSpeed, drawArray, CHANGETHIS);

        // reset colors
        states[i] = -1;
        states[min_idx] = -1;
      }

      // reset colors when finished
      for (let i = 0; i < states.length; i++) {
        states[i] = -1;
        // draw array values into canvas
        drawArray.clear(CHANGETHIS[2], CHANGETHIS[3]);
        drawArray.draw(
          CHANGETHIS[0],
          CHANGETHIS[1],
          CHANGETHIS[2],
          CHANGETHIS[3],
          CHANGETHIS[4]
        );
        return [arr, states];
      }
    },
    setSpeed: async (speed: number) => {
      sortingSpeed = speed;
    },
    setIsSorting: async (sorting: boolean) => {
      isSorting = sorting;
    },
  };
};
