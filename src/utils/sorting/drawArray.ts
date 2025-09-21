export async function DrawArray(
  arr: Array<number>,
  states: Array<number>,
  gameCanvas: any,
  ctx: any,
  resizeArray: number
) {
  // clear canvas
  await clearCanvas(ctx, gameCanvas);
  // draw array lines
  for (let i = 0; i < arr.length; i++) {
    await drawLine(i, arr[i], states, ctx, gameCanvas, resizeArray);
  }

  return {
    clear: async (ctx: any, gameCanvas: any) => {
      await clearCanvas(ctx, gameCanvas);
    },
    draw: async (
      arr: Array<number>,
      states: Array<number>,
      ctx: any,
      gameCanvas: any,
      resizeArray: number
    ) => {
      if (typeof arr !== "undefined") {
        for (let i = 0; i < arr.length; i++) {
          await drawLine(i, arr[i], states, ctx, gameCanvas, resizeArray);
        }
      } else {
      }
    },
  };
}

async function clearCanvas(ctx: any, gameCanvas: any) {
  if (typeof ctx !== "undefined") {
    //  canvas background to white
    ctx.fillStyle = "white";
    // draw rectangle on canvas
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  }
}

async function drawLine(
  index: number,
  height: number,
  states: Array<number>,
  ctx: any,
  gameCanvas: any,
  resizeArray: number
) {
  // set canvas line to different colors based current actions
  if (states[index] == 0) {
    // current index being sorted
    ctx.fillStyle = "red";
    ctx.strokestyle = "maroon";
  } else if (states[index] == -1) {
    // nothing being changed
    ctx.fillStyle = "grey";
    ctx.strokestyle = "black";
  } else {
    //being compared to red
    ctx.fillStyle = "lightgreen";
    ctx.strokestyle = "forestgreen";
  }
  // draw lines on canvas
  // set fill for line
  ctx.fillRect(
    index * resizeArray,
    gameCanvas.height - height,
    resizeArray,
    height
  );
  // set outline for line
  ctx.strokeRect(
    index * resizeArray,
    gameCanvas.height - height,
    resizeArray,
    height
  );
}
