import { SelectionSort } from "../utils/sorting/selectionsort";
// import { BubbleSort } from "../utils/sorting/bubblesort";
import { DrawArray } from "../utils/sorting/drawArray";
import { CombSort } from "./sorting/combsort";
import { InsertionSort } from "./sorting/insertionsort";
import { QuickSort } from "./sorting/quicksort";

// Global variablse
let gameCanvas: any = null;
let ctx: any = null;
let sortingSpeed: number = Math.pow(5, 3);
let states: Array<number> = [];
let values: Array<number> = [];
let valuesReset: Array<number> = [];
let valuesSize: number = 25;
let resizeArray: number = 0;
let sortingFunction: any;
let stopSorting123: boolean = false;

export const SortAlgorithm = (g: any, c: any) => {
  // Set constructor values
  gameCanvas = g;
  ctx = c;
  // randomize arrays
  randomizeArrays();

  // draw array onto the canvas
  DrawArray(values, states, gameCanvas, ctx, resizeArray);

  return {
    sort: {
      selection: () => {
        numerousSort(1);
      },
      bubble: () => {
        numerousSort(2);
      },
      insert: () => {
        numerousSort(3);
      },
      quick: () => {
        numerousSort(4);
      },
      comb: () => {
        numerousSort(5);
      },
      randomize: () => {
        randomizeArrays();
      },
      reset: async () => {
        await stopSorting().then(() => {
          resetArray();
        });
      },
      setSpeed: async (speed: number) => {
        // sortingSpeed = speed;
        sortingFunction.setSpeed(speed);
      },
      setArraySize: async (size: number) => {
        await stopSorting().then(() => {
          valuesSize = size;
          randomizeArrays();
        });
      },
    },
  };
};

async function stopSorting() {
  if (typeof sortingFunction !== "undefined") {
    await sortingFunction.setIsSorting(false).then(() => {
      return new Promise((resolve) => setTimeout(resolve, sortingSpeed));
    });
  }
}

function randomizeArrays() {
  // set spacing size for canvas
  resizeArray = gameCanvas.width / valuesSize;
  // clear arrays
  values = [];
  valuesReset = [];
  states = [];
  // new array for sorting
  for (let i = 0; i < valuesSize; i++) {
    // get random number from 0 - canvas height
    let temp = Math.floor(Math.random() * gameCanvas.height);
    // set into both arrays
    values[i] = temp;
    valuesReset[i] = temp;
    // reset states for colorizing
    states[i] = -1;
  }
  DrawArray(values, states, gameCanvas, ctx, resizeArray);
}

async function resetArray() {
  // set spacing size for canvas
  resizeArray = gameCanvas.width / valuesSize;
  // clear arrays
  values = [];
  states = [];
  // set unsorted values back into valuse
  for (let i = 0; i < valuesReset.length; i++) {
    values[i] = valuesReset[i];
  }
  // set states back to -1
  for (let i = 0; i < gameCanvas.width / resizeArray; i++) {
    states[i] = -1;
  }
  // draw array values into canvas
  DrawArray(values, states, gameCanvas, ctx, resizeArray);
}

async function numerousSort(sortingNumber: number) {
  await stopSorting()
    .then(() => {
      resetArray().then(() => {
        DrawArray(values, states, gameCanvas, ctx, resizeArray).then((v) => {
          v.clear(ctx, gameCanvas);
          v.draw(values, states, ctx, gameCanvas, resizeArray);

          let temp: Array<any> = setDrawArray();

          switch (sortingNumber) {
            case 1:
              sortingFunction = SelectionSort();
              sortingFunction.setIsSorting(true);
              sortingFunction
                .select(values, states, sortingSpeed, v, temp)
                .then((a: any) => {
                  values = a[0];
                  states = a[1];
                });
              break;
            case 2:
            // sortingFunction = BubbleSort();
            // sortingFunction.setIsSorting(true);
            // sortingFunction
            //   .bubble(values, states, sortingSpeed, v, temp)
            //   .then((a) => {
            //     values = a[0];
            //     states = a[1];
            //   });
            // break;
            case 3:
              sortingFunction = InsertionSort();
              sortingFunction.setIsSorting(true);
              sortingFunction
                .insertion(values, states, sortingSpeed, v, temp)
                .then((a: any) => {
                  values = a[0];
                  states = a[1];
                });
              break;
            case 4:
              sortingFunction = QuickSort();
              sortingFunction.setIsSorting(true);
              sortingFunction
                .quick(values, 0, valuesSize - 1, states, sortingSpeed, v, temp)
                .then((a: any) => {
                  values = a[0];
                  states = a[1];
                });
              break;
            case 5:
              sortingFunction = CombSort();
              sortingFunction.setIsSorting(true);
              sortingFunction
                .comb(values, states, sortingSpeed, v, temp)
                .then((a: any) => {
                  values = a[0];
                  states = a[1];
                });
              break;
            default:
              break;
          }
        });
      });
    })
    .catch((error) => {});
}

function setDrawArray() {
  let temp: Array<any> = [];
  temp.push(values);
  temp.push(states);
  temp.push(ctx);
  temp.push(gameCanvas);
  temp.push(resizeArray);
  return temp;
}
