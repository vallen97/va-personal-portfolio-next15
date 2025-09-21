export class Pipe {
  private pipeRect: any;
  private birdHeight: number;
  private background: DOMRect;

  constructor(bird_height: number, top_pipe?: DOMRect, bottom_pipe?: DOMRect) {
    this.background = document
      .getElementById("background")!
      .getBoundingClientRect();

    this.birdHeight = bird_height;
    if (typeof top_pipe == "undefined" && typeof bottom_pipe != "undefined")
      this.createTopPipe(bottom_pipe);
    else if (
      typeof top_pipe != "undefined" &&
      typeof bottom_pipe == "undefined"
    )
      this.createBottomPipe(top_pipe);
  }

  createTopPipe(bp?: DOMRect) {}
  createBottomPipe(tp?: DOMRect) {}
  getPipeRect(): DOMRect {
    return this.pipeRect;
  }
  setPipeHeight(bph?: number, tph?: number): Array<number> {
    let bottomPipeHeight: any = 0;
    let topPipHeight: any = 0;

    // minimum pipe height in pixel
    let pipeMinHeight: number = 100;

    // mandom number between 10-20
    // Math.floor(Math.random() * 10)+10;

    if (bph != null || typeof bph != "undefined") {
    } else {
      bottomPipeHeight = bph;
      topPipHeight =
        this.background.height - bottomPipeHeight - this.birdHeight * 2;
    }
    if (tph != null || typeof tph != "undefined") {
    } else {
      topPipHeight = tph;
      bottomPipeHeight =
        this.background.height - topPipHeight - this.birdHeight * 2;
    }

    if (
      (tph == null && bph == null) ||
      (typeof bph == "undefined" && typeof tph == "undefined")
    ) {
      let backgroundRandHeight = Math.floor(
        Math.random() * this.background.height
      );
      bottomPipeHeight = Math.floor(
        Math.random() *
          (backgroundRandHeight - pipeMinHeight - this.birdHeight) +
          pipeMinHeight
      );

      topPipHeight = Math.floor(
        this.background.height - bottomPipeHeight - this.birdHeight * 2
      );
    }

    return [topPipHeight, bottomPipeHeight];
  }
}
