// class Car {
//   Rent(type:string) : this {
//     console.log(`${type} has been rented.`);
//     return this;
//   }

//   Record() : this {
//     console.log(`Car was rented at ${new Date().toLocaleString()}`);
//     return this;
//   }

//   Return(type:string) : this {
//     console.log(`${type} has been returned.`);
//     return this;
//   }
// }

import { DrawArray as drawArrayClass } from "./drawArray";

type dArrayType = {
  value: Array<number>;
  state: Array<number>;
  ctx: HTMLCanvasElement;
  gameCanvas: HTMLCanvasElement;
  resizeArray: number;
};

class Sort {
  sortingSpeed: number = 0;
  isSorting: boolean = false;
  arr: Array<number> = new Array();
  states: Array<number> = new Array();
  speed: number = 0;
  drawArray: typeof drawArrayClass | undefined;
  drawArrayVariables: Array<dArrayType> = new Array();

  async setSpeed(speed: number) {
    this.sortingSpeed = speed;
  }
  async setIsSorting(sorting: boolean) {
    this.isSorting = sorting;
  }
}

/*
    comb: async (

      


    )
    insertion: async (





    )
    quick: async (

      start: number,
      end: number,




    )
        select: async (




    ) 

*/
