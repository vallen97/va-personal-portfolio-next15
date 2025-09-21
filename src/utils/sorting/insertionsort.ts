let sortingSpeed: number;
let isSorting: boolean = true;

// Insertion Sort
export const InsertionSort = () => {
  return {
    insertion: async (
      arr: Array<number>,
      states: Array<number>,
      speed: number,
      drawArray: any,
      CHANGETHIS: Array<any>
    ) => {
      sortingSpeed = speed;
      // loop through array length
      loop1: for (let i = 0; i < arr.length; i++) {
        // key is i
        let key: number = arr[i];
        // i - 1
        let j: number = i - 1;
        // j greater or equal to and key less than j
        while (j >= 0 && key < arr[j]) {
          if (isSorting == false) {
            break loop1;
          }
          // color comparing
          states[j] = 1;
          // color being compared
          states[j + 1] = 0;
          // sleep
          await sleep(sortingSpeed);
          // swap
          arr[j + 1] = arr[j];
          // draw array
          drawArray.clear(CHANGETHIS[2], CHANGETHIS[3]);
          drawArray.draw(
            CHANGETHIS[0],
            CHANGETHIS[1],
            CHANGETHIS[2],
            CHANGETHIS[3],
            CHANGETHIS[4]
          );
          // reset colors
          states[j] = -1;
          states[j + 1] = -1;
          // j = j -1
          j -= 1;
        }
        // put key back if key is more than j
        arr[j + 1] = key;
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

// set sleep timeout
async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
