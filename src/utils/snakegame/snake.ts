import { NeuralNetwork } from "./nn";
// import * as tf from "@tensorflow/tfjs";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
// import tf from '@/utils/snakegame/tf.min.js';

export class Snake {
  private velocityX: number;
  private velocityY: number;
  private moveLength: number;
  private totalMoves: number;
  public isDead: boolean;
  private appleseaten: number;
  private vision: Array<any>;
  private foodPosX: number;
  private foodPosY: number;
  private snakeScore: number;
  private fitness: number;
  private brain: NeuralNetwork;
  private snake: Array<{ x: number; y: number }>;

  constructor(brain?: any, secondModel?: any, savedModel?: any) {
    tf.setBackend("webgl");
    // variables
    // speed for snake
    this.velocityX = 10;
    this.velocityY = 0;
    // looping snakes will die
    this.moveLength = 100;
    this.totalMoves = 0;
    this.isDead = false;
    this.appleseaten = 0;

    // inputs for neural netword
    // 8 directions where each direction
    // checks to see if there is a wall, its body, or food
    this.vision = [];

    // position for food
    this.foodPosX = 0;
    this.foodPosY = 0;

    // set snake score and fitness
    this.snakeScore = 1;
    this.fitness = 0;

    if (brain && savedModel instanceof tf.Sequential) {
      this.brain = brain.copy(secondModel, savedModel);
    } else if (brain) {
      this.brain = brain.copy(secondModel);
    } else {
      // input: 8 directions-objects, hidden, up, down, left, right
      this.brain = new NeuralNetwork(24, 18, 4);
    }

    // make snake
    this.snake = [
      { x: 150, y: 150 },
      { x: 140, y: 150 },
      { x: 130, y: 150 },
      { x: 120, y: 150 },
      { x: 110, y: 150 },
    ];
  }

  dispose() {
    this.brain.dispose();
  }

  async save(type: number) {
    this.brain.save(type, "best_snake");
  }

  // mutate function
  mutate() {
    this.brain.mutate(0.1);
  }

  getModel() {
    return this.brain.getModel();
  }

  // check direction for food
  foodCollide(headX: number, headY: number, foodX: number, foodY: number) {
    if (headX == foodX && headY == foodY) {
      return true;
    }
    return false;
  }

  // check if snake head hit any wall
  wallCollide(headX: number, headY: number, canvas: any) {
    if (
      headX >= canvas.width - 10 ||
      headX < 0 ||
      headY >= canvas.height - 10 ||
      headY < 0
    ) {
      return true;
    }
    return false;
  }

  // check ig snake head hit itself
  bodyCollide(headX: number, headY: number) {
    for (let i: number = 4; i < this.snake.length; i++) {
      // if snake hit itself
      if (this.snake[i].x == headX && this.snake[i].y == headY) {
        return true;
      }
    }
    return false;
  }

  // think function neural network
  think() {
    // send directions into nn
    let decision = this.brain.predict(this.vision);

    // check which direction to move the sanke
    let maxIndex: number = 0;
    let max: number = 0;
    for (let i: number = 0; i < decision.length; i++) {
      if (decision[i] > max) {
        max = decision[i];
        maxIndex = i;
      }
    }
    // chage direction
    if (maxIndex == 0) {
      this.changeDirection(39);
    } else if (maxIndex == 1) {
      this.changeDirection(37);
    } else if (maxIndex == 2) {
      this.changeDirection(38);
    } else if (maxIndex == 3) {
      this.changeDirection(40);
    }
  }

  // https://github.com/greerviau/SnakeAI/blob/master/SnakeAI/Snake.pde
  // have a snake look in every direction
  look(canvas: HTMLCanvasElement) {
    // reset array
    this.vision = [];
    // pass snake location x and y, position to the right, left, ect,
    //      food location x and y, canvas

    // look left
    let temp: any = this.lookInDirection(
      this.snake[0].x,
      this.snake[0].y,
      -10,
      0,
      canvas
    );
    this.vision[0] = temp[0];
    this.vision[1] = temp[1];
    this.vision[2] = temp[2];
    // look up left
    temp = this.lookInDirection(
      this.snake[0].x,
      this.snake[0].y,
      -10,
      10,
      canvas
    );
    this.vision[3] = temp[0];
    this.vision[4] = temp[1];
    this.vision[5] = temp[2];
    // look up
    temp = this.lookInDirection(
      this.snake[0].x,
      this.snake[0].y,
      0,
      10,
      canvas
    );
    this.vision[6] = temp[0];
    this.vision[7] = temp[1];
    this.vision[8] = temp[2];
    // look up right
    temp = this.lookInDirection(
      this.snake[0].x,
      this.snake[0].y,
      10,
      10,
      canvas
    );
    this.vision[9] = temp[0];
    this.vision[10] = temp[1];
    this.vision[11] = temp[2];
    // look right
    temp = this.lookInDirection(
      this.snake[0].x,
      this.snake[0].y,
      10,
      0,
      canvas
    );
    this.vision[12] = temp[0];
    this.vision[13] = temp[1];
    this.vision[14] = temp[2];
    // look down right
    temp = this.lookInDirection(
      this.snake[0].x,
      this.snake[0].y,
      10,
      -10,
      canvas
    );
    this.vision[15] = temp[0];
    this.vision[16] = temp[1];
    this.vision[17] = temp[2];

    // look down
    temp = this.lookInDirection(
      this.snake[0].x,
      this.snake[0].y,
      0,
      -10,
      canvas
    );
    this.vision[18] = temp[0];
    this.vision[19] = temp[1];
    this.vision[20] = temp[2];

    // look down left
    temp = this.lookInDirection(
      this.snake[0].x,
      this.snake[0].y,
      -10,
      -10,
      canvas
    );
    this.vision[21] = temp[0];
    this.vision[22] = temp[1];
    this.vision[23] = temp[2];
  }

  // function from
  // https://github.com/Code-Bullet/SnakeFusion/blob/master/SmartSnakesCombine/Snake.pde
  // modified from java to javascript
  lookInDirection(
    headX: number,
    headY: number,
    headXPos: number,
    headYPos: number,
    canvas: HTMLCanvasElement
  ) {
    //look in a direction and check for food, body and wall
    let foodX: number = this.foodPosX;
    let foodY: number = this.foodPosY;
    //set up a temp array to hold the values that are going to be passed to the main vision array
    let visionInDirection: Array<number> = [0, 0, 0];

    let tempHeadX: number = headXPos;
    let tempHeadY: number = headYPos;

    // PVector position = new PVector(pos.x, pos.y);//the position where we are currently looking for food or tail or wall
    let foodIsFound: boolean = false; //true if the food has been located in the direction looked
    let tailIsFound: boolean = false; //true if the tail has been located in the direction looked
    let distance: number = 0;
    //move once in the desired direction before starting
    // position.add(direction);
    distance += 1;

    //look in the direction until you reach a wall
    while (!this.wallCollide(headX + tempHeadX, headY + tempHeadY, canvas)) {
      //check for food at the position
      if (
        !foodIsFound &&
        this.foodCollide(headX + tempHeadX, headY + tempHeadY, foodX, foodY)
      ) {
        visionInDirection[0] = 1;
        foodIsFound = true; // dont check if food is already found
      }

      //check for tail at the position
      if (
        !tailIsFound &&
        !this.bodyCollide(headX + tempHeadX, headY + tempHeadY)
      ) {
        visionInDirection[1] = 1 / distance;
        tailIsFound = true; // dont check if tail is already found
      }

      //look further in the direction
      // position.add(direction);
      distance += 1;

      tempHeadX += headXPos;
      tempHeadY += headYPos;
    }

    //set the distance to the wall
    visionInDirection[2] = 1 / distance;

    return visionInDirection;
  }

  advanceSnake() {
    // create snakes head
    let head: { x: number; y: number } = {
      x: this.snake[0].x + this.velocityX,
      y: this.snake[0].y + this.velocityY,
    };

    // add head to start of snake
    this.snake.unshift(head);
    let didEatFood: boolean = false;

    if (this.snake[0].x == this.foodPosX && this.snake[0].y == this.foodPosY) {
      didEatFood = true;
    }

    if (didEatFood) {
      this.appleseaten++;
      this.snakeScore++;
      // add 100 move to snake if food is eaten
      this.moveLength += 100;
      if (this.moveLength > 500) {
        this.moveLength = 500;
      }
      // this.moveLength = this.moveLength + 15 * this.appleseaten;
      // this.createFood();
      return true;
    } else {
      // remove the last part of snake
      this.snake.pop();
      // return false;
    }
  }

  // mvoe into snake and retutn tru or false se we can delete the correct snake
  gameEnded(gameCanvas: any) {
    // loop through snake body starting at 4
    for (let i: number = 4; i < this.snake.length; i++) {
      // console.log(snakes[j]);
      // if snake hit itself
      if (
        this.snake[i].x == this.snake[0].x &&
        this.snake[i].y == this.snake[0].y
      ) {
        // savedSnakes.push(snakes.splice(j, 1)[0]);
        return true;
      }
    }
    // get boundries of walls to check if sanke hit them
    // if hot return true else return false
    if (this.snake[0].x < 0) {
      return true;
    } else if (this.snake[0].x > gameCanvas.width - 10) {
      return true;
    } else if (this.snake[0].y < 0) {
      return true;
    } else if (this.snake[0].y > gameCanvas.height - 10) {
      return true;
    } else {
      return false;
    }
  }

  drawSnake(ctx: any) {
    // loop through snake body starting at 4
    for (let i: number = 0; i < this.snake.length; i++) {
      // Set the colour of the snake part
      ctx.fillStyle = "lightgreen";
      // Set the border colour of the snake part
      ctx.strokestyle = "darkgreen";
      // the part is located
      ctx.fillRect(this.snake[i].x, this.snake[i].y, 10, 10);
      // Draw a border around the snake part
      ctx.strokeRect(this.snake[i].x, this.snake[i].y, 10, 10);
    }
  }

  drawFood(ctx: any) {
    //  food background color
    ctx.fillStyle = "red";
    //  food border color
    ctx.strokestyle = "darkred";
    // draw food to canvas
    ctx.fillRect(this.foodPosX, this.foodPosY, 10, 10);
    ctx.strokeRect(this.foodPosX, this.foodPosY, 10, 10);
  }

  createFood(gameCanvas: any) {
    //   // Generate a random number the food x-coordinate
    this.foodPosX =
      Math.round((Math.random() * (gameCanvas.width - 10 - 0) + 0) / 10) * 10;
    //   // Generate a random number for the food y-coordinate
    this.foodPosY =
      Math.round((Math.random() * (gameCanvas.height - 10 - 0) + 0) / 10) * 10;

    // for(let snake of snakes){
    // loop through snake
    for (let i: number = 0; i < this.snake.length; i++) {
      // if food spawns on snake
      if (
        this.snake[i].x == this.foodPosX &&
        this.snake[i].y == this.foodPosY
      ) {
        this.createFood(gameCanvas);
      }
    }
    // }
  }

  // change the direction of the sanke
  changeDirection(keyPressed: number) {
    this.moveLength--;
    this.totalMoves++;
    if (this.moveLength <= 0) {
      this.isDead = true;
    }

    let leftKey: number = 37;
    let rightKey: number = 39;
    let upKey: number = 38;
    let downKey: number = 40;

    let goingUp: boolean = false;
    let goingDown: boolean = false;
    let goingRight: boolean = false;
    let goingLeft: boolean = false;

    if (this.velocityY == -10) {
      goingUp = true;
    }
    if (this.velocityY == 10) {
      goingDown = true;
    }
    if (this.velocityX == 10) {
      goingRight = true;
    }
    if (this.velocityX == -10) {
      goingLeft = true;
    }

    if (keyPressed === leftKey && !goingRight) {
      this.velocityX = -10;
      this.velocityY = 0;
    }

    if (keyPressed === upKey && !goingDown) {
      this.velocityX = 0;
      this.velocityY = -10;
    }

    if (keyPressed === rightKey && !goingLeft) {
      this.velocityX = 10;
      this.velocityY = 0;
    }

    if (keyPressed === downKey && !goingUp) {
      this.velocityX = 0;
      this.velocityY = 10;
    }
  }
}
