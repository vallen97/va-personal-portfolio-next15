import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import { Snake as SnakeClass } from "./snake";

// References:
// snake game
// https://medium.freecodecamp.org/think-like-a-programmer-how-to-build-snake-using-only-javascript-html-and-css-7b1479c3339e

// set variables for game
// load models
let loadedModel: any;
let isLocalModel: boolean;
let isWebsiteModel: boolean;
// game score
let gameScore: number;
// canvas and context
let gameCanvas: HTMLCanvasElement;
// let ctx: any;
// tell user current generation
let currentGen: number;
// check if user is loading or saving snake
let saveBest: boolean;
let saveBestType: number;
let loadBest: boolean;
// slider to adjust game speed
let gameSpeed: number;
// TOTAL number of snales
let TOTAL: number;
// empty array of snakes
let snakes: Array<SnakeClass> = new Array();
// temp for finding firness
let savedSnakes: Array<any>;
// temp for loading best snake
let loadBestSnakeObject: any;
let txtCurrGen: any;
let txtSnakeScore: any;
let textSnakesAlive: any;

// g = inital canvas,  c = canvas, tcg = text of current generation, tss = text of current snake score
export const Game = (
  g: HTMLCanvasElement,
  c: CanvasRenderingContext2D,
  tcg: any,
  tss: any,
  tsa: any
) => {
  // loadedModel = loadSnakeModel();
  // Set inital values
  isLocalModel = false;
  isWebsiteModel = false;
  gameScore = 0;
  gameCanvas = g;
  // ctx = c;
  currentGen = 1;
  saveBest = false;
  loadBest = false;
  gameSpeed = 100;
  TOTAL = 1;
  snakes = [];
  savedSnakes = [];
  txtCurrGen = tcg;
  txtSnakeScore = tss;
  textSnakesAlive = tsa;

  // txtCurrGen.innerText = "in Game() set generation";
  // txtSnakeScore.innerText = "in Game() set snake Score";
  // console.log(txtCurrGen.value);
  // console.log(txtSnakeScore.value);

  clearCanvas(c);

  // make snakes
  for (let j = 0; j < TOTAL; j++) {
    // create instance of snake
    snakes[j] = new SnakeClass();
  }

  for (let i = 0; i < snakes.length; i++) {
    snakes[i].createFood(gameCanvas);
  }

  return {
    start: (ctx: any) => {
      game(ctx);
    },
    setSaveBest: async () => {
      saveBest = true;
    },
    setLoadBest: async () => {
      loadBest = true;
    },
    setGameSpeed: async (speed: number) => {
      gameSpeed = speed;
    },
    setSnakePlayers: (players: number) => {
      TOTAL = players;
    },
    nextGen: () => {
      for (let j = snakes.length - 1; j >= 0; j--)
        savedSnakes.push(snakes.splice(j, 1)[0]);
    },
    loadCustomSnake: (type: number, snakeJSON?: any) => {
      loadSnakeModel(type, snakeJSON).then((res: any) => {
        loadedModel = res;
      });
    },
    saveCustomSnake: async (type: number) => {
      console.log("SaveCustomSnake()");
      saveBestType = type;
      saveBest = true;
    },
  };
};

// Game function
async function game(ctx: any) {
  // gameEnded();
  // check if all snakes array is empty
  if (snakes.length === 0) {
    // reset score
    gameScore = 0;
    // call next generation
    await nextGeneration();
    // create need food
    for (let snake of snakes) {
      snake.createFood(gameCanvas);
    }
  }
  // timeout
  setTimeout(function () {
    // clear canvas
    clearCanvas(ctx);
    // check if snake hit the wall, if so destroy the snake
    for (let j = snakes.length - 1; j >= 0; j--) {
      if (snakes[j].gameEnded(gameCanvas) == true || snakes[j].isDead == true) {
        savedSnakes.push(snakes.splice(j, 1)[0]);
      }
    }

    for (let snake of snakes) {
      textSnakesAlive.innerText = "Snakes Alive: " + snakes.length;
      // find objects in 8 different directions
      snake.look(gameCanvas);

      // make snake move
      snake.think();
      // set changing direction to false
      // snake.isChangingDir = false;

      // move snake
      if (snake.advanceSnake() == true) {
        // make new food
        snake.createFood(gameCanvas);
        gameScore += 10;
        txtSnakeScore.innerText = "Score: " + gameScore;
      }
      // draw snake and food
      snake.drawSnake(ctx);
      snake.drawFood(ctx);
    }
    // Call game again
    game(ctx);
  }, gameSpeed); // call every 10ms
}

function clearCanvas(ctx: any) {
  //  canvas background to white
  ctx.fillStyle = "white";
  //  canvas border to black
  ctx.strokestyle = "black";
  // draw rectangle on canvas
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  // draw rectangle border on canvas
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

async function nextGeneration() {
  // update text with current generation
  currentGen += 1;
  txtCurrGen.innerText = " Current Score: " + currentGen;

  let bestSnake: SnakeClass;

  // call calculateFitness
  calculateFitness();

  if (loadBest == true) {
    // if user pressed load best snake
    // set back to false
    loadBest = false;

    // NOTE: Change to to 5 snakes
    TOTAL = 5;

    await loadedModel.then(function (lm: any) {
      // make snakes
      for (let i = 0; i < TOTAL; i++) {
        snakes[i] = pickOne(lm);
      }
    });
    // // make snakes
    // for (let i = 0; i < TOTAL; i++) {
    //   snakes[i] = pickOne(loadedModel);
    // }
  } else {
    // make best snake
    for (let i = 0; i < TOTAL; i++) {
      snakes[i] = pickOne();
    }
  }

  // // dispose of unused tensor, for memory management
  for (let i = 0; i < savedSnakes.length; i++) {
    savedSnakes[i].dispose();
  }

  // clear saved snakes
  savedSnakes = [];
}

// TODO: Maybe append the model that was pick out, so we dont dispose()

function pickOne(model?: any) {
  var index = 0;
  // var r = random(1);
  var r = Math.random();

  while (r > 0) {
    // NOTE: snakes only have fitness when collecting food
    if (typeof savedSnakes[index].fitness === "undefined") {
      continue;
    }

    r = r - savedSnakes[index].fitness;

    index++;
  }
  index--;

  // get the best snake
  let snake = savedSnakes[index];
  let secondSnakeModel: any;

  if (TOTAL > 0) secondSnakeModel = snake.getModel();
  // save best snake
  if (saveBest == true) {
    snake.save(saveBestType);
    // set to false
    saveBest = false;
  }
  var child: SnakeClass;

  if (model) {
    // make new snake with brain and model
    child = new SnakeClass(snake.brain, null, model);
  } else {
    // make new snake with brain
    if (TOTAL > 0) {
      child = new SnakeClass(snake.brain, secondSnakeModel);
    } else {
      child = new SnakeClass(snake.brain, null);
    }
  }
  // call mutate
  child.mutate();

  return child;
}

function calculateFitness() {
  // variable
  var sum = 0;
  // loop through all saved snakes
  for (let snake of savedSnakes) {
    // get the sum of snake score
    sum += snake.snakeScore * snake.totalMoves;
  }
  // loop though snakes
  for (var snake of savedSnakes) {
    // set fitness
    if (sum <= 0) {
      snake.fitness = 0;
    } else {
      snake.fitness = (snake.snakeScore * snake.totalMoves) / sum;
    }
  }
}

async function loadSnakeModel(type: number, snakeJSON?: any) {
  // load snake model from the browser
  var model;
  var isLoaded = false;

  switch (type) {
    case 0:
      // load model from users browsers local storage
      try {
        model = await tf.loadLayersModel("localstorage://best_snake");
        console.log("Loaded local model");
        isLoaded = true;
        isLocalModel = true;
      } catch (err: any) {
        // if there is no saved model
        console.log(err.message);
      }
      break;
    case 1:
      // load model from website
      try {
        model = await tf.loadLayersModel("/static/snakeai/best_snake.json");
        console.log("Best snakes loaded from url");
        isLoaded = true;
        isWebsiteModel = true;
      } catch (err: any) {
        console.log(err.message);
      }

      break;
    case 2:
      // load model from the users computer
      try {
        model = await tf.loadLayersModel(snakeJSON);
        console.log("Best snakes loaded from file");
        isLoaded = true;
        isWebsiteModel = true;
      } catch (err: any) {
        console.log(err.message);
      }

      break;
    default:
      console.log("No Snake Model Loaded.");

      break;
  }

  // check if model is a model and a model is loaded
  if (model instanceof tf.Sequential && isLoaded == true) {
    // return model
    return model;
  }
}
