export async function mergeSort(arr: Array<number>, states: any, temp: number) {
  //   // Note: Currently not completed for comments
  //   // Note: Works but doesn't animate changing
  //   if (arr.length <= 1) {
  //     return;
  //   }
  //   let mid: number = Math.round(arr.length / 2);
  //   let left: Array<number> = arr.slice(0, mid);
  //   let right: Array<number> = arr.slice(mid, arr.length);

  //   mergeSort(left, states, 1);
  //   mergeSort(right, states, 2);

  //   let i = 0;
  //   let j = 0;
  //   let k = 0;

  //   // NOTE: New arrays are created and are merged together
  //   // NOTE: What I can maybe do is make a second array and
  //   //       check new array number against copied array, and
  //   //       get array index and change state and get current index
  //   //       One problem is if there are more of the same numbers, that
  //   //       are being compared we can get the first one, but every
  //   //       number after that we would need to keep track if it.

  //   while (i < left.length && j < right.length) {
  //     await sleep(sortingSpeed);
  //     if (left[i] <= right[j]) {
  //       arr[k] = left[i];
  //       i++;
  //     } else {
  //       arr[k] = right[j];
  //       j++;
  //     }

  //     drawArray(arr, states);

  //     k++;
  //   }
  //   while (i < left.length) {
  //     await sleep(sortingSpeed);
  //     arr[k] = left[i];
  //     drawArray(arr, states);

  //     i++;
  //     k++;
  //   }
  //   while (j < right.length) {
  //     await sleep(sortingSpeed);
  //     arr[k] = right[j];
  //     drawArray(arr, states);

  //     j++;
  //     k++;
  //   }
  //   // reset colors when finished
  //   for (let i = 0; i < states.length; i++) {
  //     states[i] = -1;
  //     // draw array values into canvas
  //     drawArray(values, states);
  //   }
  return 0;
}
