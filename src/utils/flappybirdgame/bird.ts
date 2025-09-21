import { NeuralNetwork } from "../snakegame/nn";
// import * as tf from "@tensorflow/tfjs";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
// import tf from '@/utils/snakegame/tf.min.js';

//
export class Bird {
  private score: number;
  private velocityX: number;
  private velocityY: number;
  // public isDead: boolean;
  // private vision: Array<any>;
  // private pipePosXY: Array<any>;
  private fitness: number;
  private brain: NeuralNetwork;
  // private bird: Array<{ x: number; y: number }>;
  private move_speed: number;
  // private gravity: number;
  private moveUp: boolean;
  private endGame: boolean;
  // props are thhe birds image, divs, and any other html elements that its needs
  // private props: any;
  private bird_props: any;
  private bird_element: any;
  // private pipe_Props: DOMRect;
  private birdTopPos: number;
  // private birdHeight: number;
  private hasBirdImage: boolean;
  // private birdWidth: number;
  private background: any;
  private topPipe: any;
  private bottomPipe: any;
  private scaleSpeed: number;
  // private backHbybackW: number;
  // private middleofBirdX: number;

  constructor(brain?: any, secondModel?: any, savedModel?: any) {
    tf.setBackend("webgl");
    //variables
    //speed for bird
    this.velocityX = 1;
    this.velocityY = 5;
    // this.isDead = false;
    this.fitness = 0;
    this.move_speed = 5;
    // this.gravity = 0.1; // original .05
    this.score = 0;
    // this.birdHeight = 100;
    // this.birdWidth = 100;
    this.scaleSpeed = this.scale(this.move_speed, -12, 12, 0, 1);
    this.hasBirdImage = false;
    // this.middleofBirdX = 0;
    this.moveUp = false;

    this.endGame = false;
    this.bird_props = null;
    this.bird_element = null;

    this.birdTopPos = 0;

    this.background = null;

    // if (Math.random() < 0.5) this.moveUp = false;
    // else this.moveUp = true;

    // IF there is a saved model for the bird
    if (savedModel != null) {
      this.brain = new NeuralNetwork(savedModel, 5, 8, 2);
    } else if (brain) {
      // If there is no daved model, so we load the brain from the last generation
      // SHould we emoty and no second model

      this.brain = brain.copy();
    } else {
      // If there is no bird, or saved model, running for the first time
      this.brain = new NeuralNetwork(5, 8, 2);
    }
  }

  dispose() {
    this.brain.dispose();
  }

  async save(type: number) {
    this.brain.save(type, "best_bird");
  }

  // mutate function
  mutate() {
    this.brain.mutate(0.1);
  }

  getModel() {
    return this.brain.getModel();
  }

  look(allPipes: Array<any>) {
    if (allPipes.length < 1) return;

    let closest: HTMLElement = this.findClosestPipe(allPipes);

    if (closest == null || typeof closest == "undefined") {
      this.moveUp = false;
      return;
    }

    let inputs: Array<number> = [];
    inputs[0] = this.scale(
      closest.offsetLeft,
      this.bird_element.offsetLeft,
      this.background.width,
      0,
      1
    );

    inputs[1] = this.scale(closest.offsetTop, 0, this.background.height, 0, 1);

    inputs[2] = this.scale(
      closest.getBoundingClientRect().bottom - this.background.bottom,
      0,
      this.background.height,
      0,
      1
    );

    inputs[3] = this.scale(
      this.bird_element.offsetTop + this.bird_element.height / 2,
      0,
      this.background.height,
      0,
      1
    );

    inputs[4] = this.scaleSpeed;

    let output: Array<number> = [];
    output = this.brain.predict(inputs);

    this.moveUp = false;
    if (output[0] < output[1]) this.moveUp = true;
  }

  checkPipeCollision(): any {
    if (
      typeof this.topPipe == "undefined" ||
      typeof this.bottomPipe == "undefined" ||
      typeof this.background == "undefined" ||
      typeof this.bird_props == "undefined"
    )
      return true;

    // Compare is for the top pipe

    let pipe_height = Math.floor(
      this.topPipe.height + this.bottomPipe.height - this.background.height
    );

    if (pipe_height < 0) pipe_height *= -1;

    let offSetTop = this.bird_element.offsetTop;

    // Note Return true bird hit a pipe, false bird didnt hit a pipe
    if (
      this.bird_props.right > this.topPipe.left &&
      this.bird_props.right < this.topPipe.right
    ) {
      if (
        offSetTop > this.topPipe.height &&
        offSetTop <
          this.background.height -
            this.bottomPipe.height -
            this.bird_props.height
      ) {
        return false;
      } else {
        return true;
      }
    }
  }

  checkBackgroundCollision(): any {
    // check if the bird has hit the top top or bottom of the background
    if (
      typeof this.background == "undefined" ||
      typeof this.bird_props == "undefined"
    )
      return;
    let offSetTop: any;
    if (this.bird_element.offsetTop) offSetTop = this.bird_element.offsetTop;
    else offSetTop = 19;
    if (offSetTop > 0) {
      if (offSetTop + this.bird_element.offsetHeight < this.background.height) {
        return false;
      } else {
        return true;
      }
    } else if (offSetTop < 0) {
      return true;
    }
    return false;
  }

  addScore() {}

  applyGravity(gravity: number = 0.1) {
    if (!this.hasBirdImage) return;

    if (this.moveUp) {
      this.velocityY = gravity;
    } else {
      this.velocityY = gravity * -1;
    }
    this.birdTopPos += this.velocityY;

    let SGravity: string = this.birdTopPos + "px";

    this.score++;
    this.bird_element.style.top = SGravity;
    this.bird_props = this.bird_element.getBoundingClientRect();
  }
  // gravtity:  0.5 timesGravity:  0.75
  //

  // // Look for the pipe, and the top and bottom on the play area
  // look() {}

  // //   Happenps when the bird hits something
  // endGame() {}

  // displayBird() {}

  getScore(): number {
    if (this.score < 1) return 1;
    return this.score;
  }
  getEndGame() {
    this.endGame;
  }
  setScore(birdScore: number): void {
    this.score = birdScore;
  }
  setFitness(birdFitness: number): void {
    this.fitness = birdFitness;
  }
  /** Get private variable of fitness*/
  getFitness(): number {
    return this.fitness;
  }
  getBirdBrain(): NeuralNetwork {
    return this.brain;
  }
  clearVariables() {
    // this.bird_props = null;
    // this.bird_element = null;
    // this.pipe_Props = null;
    // this.hasBirdImage = false;
  }
  getBirdElement(): HTMLImageElement {
    return this.bird_element;
  }
  makeBirdImage(): void {
    let background: DOMRect = document
      .getElementById("background")!
      .getBoundingClientRect();

    let img = document.createElement("img");
    img.src = "/static/flappbirds/flappy-bird.png";
    img.className = "bird";

    img.alt = "bird-img";
    img.style.height = "100px";
    img.style.width = "160px";
    img.style.position = "absolute";

    // let height = screen.height;
    // let minHeight = Math.round(height * 0.15);
    // let maxHeight = Math.round(height - 2 * minHeight);

    let bird_img_height: number = 100;

    // Set random starting point
    let maxHeight: number = background.height - bird_img_height;
    let rngTop: number = Math.floor(Math.random() * (maxHeight - 100)) + 100;

    this.birdTopPos = rngTop;
    img.style.top = this.birdTopPos + "px";
    img.style.left = "10vw";
    img.style.zIndex = "100";
    document.getElementById("background")!.appendChild(img);
    this.bird_props = img.getBoundingClientRect();
    this.bird_element = img;
    this.hasBirdImage = true;

    // Note Adding lowers the bird, subtract move the bird up
    // this.getBirdOutput();
  }
  getHasBirdImage(): boolean {
    return this.hasBirdImage;
  }
  setHasBirdImage(birdImageElement: boolean) {
    this.hasBirdImage = birdImageElement;
  }

  /** Set the closes pipes top and bottom */
  setTopPipe(tp: DOMRect) {
    this.topPipe = tp;
  }

  setBottomPipe(bp: DOMRect) {
    this.bottomPipe = bp;
  }

  /** Set the background */
  setBackground(back: DOMRect) {
    this.background = back;
  }

  offsetElementfunction(element1: number, element2: number) {
    return this.returnPositiveNumber(element1 - element2);
  }

  // Or maybe just set it when the bird image is created
  setBirdImage(index: number) {
    this.bird_props = document
      .getElementsByClassName("bird")
      [index].getBoundingClientRect();
  }

  getBirdOutput() {
    let allPipes: any = document.querySelectorAll(".pipe_sprite");

    // Find the closest pipe

    // NOTE: For some reason pipeCoordinates cannot use left, right, top, bottom

    let closest: HTMLElement = this.findClosestPipe([allPipes[0], allPipes[1]]);

    if (closest == null || typeof closest == "undefined") {
      this.moveUp = false;
      return;
    }

    // let inputs = [];
    // inputs[0] = this.bird_element.offsetTop / this.background.height;
    // inputs[1] = closest.offsetTop / this.background.height;
    // inputs[2] =
    //   closest.offsetTop + closest.offsetHeight / this.background.height;
    // inputs[3] = closest.offsetLeft / this.background.width;
    // inputs[4] = this.speedBy10;

    // We get all the inputs and normalize them between 0 and 1
    let inputs = [];
    // The 5 inpputs I have chosen for the network are
    // 1. The horizontal distance of the pipe from the bird
    inputs[0] = this.scale(
      closest.offsetLeft,
      this.bird_element.offsetLeft,
      this.background.width,
      0,
      1
    );

    // 2. top of the closest pipe
    inputs[1] = this.scale(closest.offsetTop, 0, this.background.height, 0, 1);

    // 3. bottom of the closest pipe
    inputs[2] = this.scale(
      closest.getBoundingClientRect().bottom - this.background.bottom,
      0,
      this.background.height,
      0,
      1
    );

    // 4. bird's y position
    inputs[3] = this.scale(
      this.bird_element.offsetTop + this.bird_element.height / 2,
      0,
      this.background.height,
      0,
      1
    );

    // 5. bird's velocity
    inputs[4] = this.scale(this.move_speed, -12, 12, 0, 1);
    // let output: Array<number> = this.brain.predict(inputs);
  }

  calulateBetweenElements(element1: number, element2: number): number {
    element1 = this.returnPositiveNumber(element1);
    element2 = this.returnPositiveNumber(element2);
    let difference = this.returnPositiveNumber(element1 - element2);

    if (element1 < element2) return element1 + difference / 2;
    else return element2 + difference / 2;
  }

  returnPositiveNumber(num: number): number {
    if (num < 0) num *= -1;
    return num;
  }
  calculateDistanceBetweenCoords(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) {
    y1 = this.returnPositiveNumber(y1);
    y2 = this.returnPositiveNumber(y2);
    x1 = this.returnPositiveNumber(x1);
    x2 = this.returnPositiveNumber(x2);

    let distance = Math.sqrt(
      Math.pow(x2 - x1, 2) + Math.sqrt(Math.pow(y2 - y1, 2))
    );
    return distance;
  }

  findClosestPipe(pipes: Array<any>): any {
    if (pipes[0] == null || typeof pipes[0] == "undefined") return;
    if (pipes[1] == null || typeof pipes[1] == "undefined") return;

    let closest: any = null;

    let birdHalfY =
      this.bird_element.offsetTop + this.bird_element.offsetHeight / 2;

    let realBottomPipeTop = pipes[1].offSetTop;
    let realTopPipeBottom = pipes[0].offSetbottom;

    let topPipeHeight = pipes[1].offSetheight;
    let bottomPipeHeight = pipes[0].offSetheight;
    let spaceBetween = topPipeHeight + bottomPipeHeight;

    if (bottomPipeHeight + spaceBetween / 2 > birdHalfY) closest = pipes[0];
    else closest = pipes[1];

    // just want the number 1 and 0 as they are the closest pipes to the bird
    let spaceBetweenPipesY = this.calulateBetweenElements(
      realTopPipeBottom,
      realBottomPipeTop
    );

    if (birdHalfY < spaceBetweenPipesY) closest = pipes[0];
    else closest = pipes[1];

    return closest;
  }

  scale(
    num: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
  ) {
    return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }
}
