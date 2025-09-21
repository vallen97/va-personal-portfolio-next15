import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import { Bird as BirdClass } from "./bird";

// set variables for game
// load models
let loadedModel: any;
let isLocalModel: boolean;
let isWebsiteModel: boolean;
// game score
let gameScore: number;
// tell user current generation
let currentGen: number;
// check if user is loading or saving snake
let saveBest: boolean;
let saveBestType: number;
let loadBest: boolean;
// slider to adjust game speed
let gameSpeed: number;
// TOTAL number of birds
let TOTAL: number;
// empty array of snakes
let birds: Array<BirdClass>;
// temp for finding firness
let savedBirds: Array<BirdClass>;
// temp for loading best snake
let txtCurrGen: HTMLElement;
let txtScore: HTMLElement;
let game_state: string;
let move_speed: number;
let gravity: number; // NOTE: anything above 0.01 is too much
let background: DOMRect;
let bird_dy: number;
let pipe_seperation: number;
let isPlayingGame: boolean;
let birdWidth: number;
let birdHeight: number;
let createdNewBirds: boolean;
let created_pipe: boolean; // false can create pipe, true cannot create pipe
let requestsIDs: Array<number>;
let txtBirdsAlive: any;

export const flappyGame = (tcg: any, ts: any, tba: any) => {
  // set backend to use for tensorflow
  tf.setBackend("webgl");

  // loadedModel = loadSnakeModel();
  // Set inital values
  // if the user wants to load a AI model and from where
  isLocalModel = false;
  isWebsiteModel = false;
  // set game score
  gameScore = 0;
  // set generetaion to keep track
  currentGen = 1;
  // is the user want to save the AI model
  saveBest = false;
  // if the user want to Load an AI model
  loadBest = false;
  // Set game Speed
  gameSpeed = 100;
  // Check if the game is playing
  isPlayingGame = false;

  // Total number of birds
  TOTAL = 10;
  // enpty array
  birds = [];
  savedBirds = new Array();
  // HTML Elements to update the user
  move_speed = 2;
  gravity = 1.5; // original.5

  pipe_seperation = 0;
  // Set based on the screen width
  birdWidth = 100;
  birdHeight = 100;
  created_pipe = false;
  createdNewBirds = false;
  requestsIDs = [];

  clearPage();
  // clearVariables();

  background = document.querySelector(".background")!.getBoundingClientRect();
  txtCurrGen = tcg;
  txtScore = ts;
  txtBirdsAlive = tba;
  // // make birds
  // for (let j = 0; j < TOTAL; j++) {
  //   // create instance of snake
  //   birds[j] = new BirdClass();
  // }

  // make Pipes
  //  In Game class
  //  or make pipe class

  return {
    start: () => {
      startGame();
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

    nextGen: () => {
      for (let j = birds.length - 1; j >= 0; j--)
        savedBirds.push(birds.splice(j, 1)[0]);
    },
    loadCustomBird: (type: number, birdJSON?: any) => {
      loadBirdModel(type, birdJSON).then((value: any) => {
        loadedModel = value;
      });
    },
    saveCustomBird: async (type: number) => {
      saveBestType = type;
      saveBest = true;
    },
  };
};
function startGame() {
  // set game variables
  game_state = "Play";
  isPlayingGame = true;
  // make birds
  if (!createdNewBirds)
    for (let j = 0; j < TOTAL; j++) {
      // create instance of snake
      birds[j] = new BirdClass();
    }
  // call functions to start the game
  setup();
  game();
}

function setup() {
  // HTML elements below might need to be passed into the class
  background = document.querySelector(".background")!.getBoundingClientRect();

  create_pipe();

  if (createdNewBirds == false)
    for (let j = 0; j < TOTAL; j++) {
      birds[j].setBackground(background);
      birds[j].makeBirdImage();
    }

  // findBirds();

  // Setting initial game state to start
  game_state = "Start";

  // create_pipe();
}

async function game() {
  // Add an eventlistener for key presses
  document.addEventListener("keydown", (e) => {
    // Start the game if enter key is pressed
    if (e.key == "Enter" && game_state != "Play") beforeStart();
  });
  // NOTE: THIS ID FOR WHEN THE BIRD WHEN YOU WANT TO BIRD TO PLAY THE GAME BY ITSELF
  if (isPlayingGame) beforeStart();
  //When the game starts by the user the game will continue,
  // so the user doesnt need to press another enter key
  // if (isPlayingGame && game_state == 'Play') beforeStart();
}

function beforeStart() {
  document.querySelectorAll(".pipe_sprite").forEach((e) => {
    e.remove();
  });

  game_state = "Play";

  play();
}

function play() {
  // move();
  requestsIDs.push(requestAnimationFrame(move));
  // make slider so the birds can speed up or slow down
  // MOTE: Just get the game to run
  bird_dy = 0;
  requestsIDs.push(requestAnimationFrame(apply_gravity));

  requestsIDs.push(requestAnimationFrame(create_pipe));
}

function move() {
  // if (!isPlayingGame) return;
  // if (birds.length <= 0) return;

  let index: number = 0;
  // Getting reference to all the pipe elements
  let pipe_sprite: any = document.querySelectorAll(".pipe_sprite");

  let temp1: any = null;
  let temp2: any = null;

  pipe_sprite.forEach(async (element: any) => {
    // console.log('Pipe Element: ', element);

    // if (element.style.position == 'absolute')
    if (element.style.position != "absolute")
      if (element.id == "Top_Pipe") {
        temp1 = element;

        element.style.top = "0px";
        element.style.right = "0px";
        element.style.zIndex = "99";
        element.style.position = "absolute";
        element.style.height = "100px";
        element.style.width = birdWidth * 2 + "px";
        element.style.color = "black";
      } else if (element.id == "Bottom_Pipe") {
        temp2 = element;
        element.style.bottom = "0px";
        element.style.right = "0px";
        element.style.zIndex = "99";
        element.style.height = "100px";
        element.style.width = "150px";
        element.style.position = "absolute";
      }

    // let tempRealRight = pipe_sprite[0].getBoundingClientRect().right - document.getElementById('background').getBoundingClientRect().right

    // if the pipe goes goes paset the background of the game minus the pipe width
    if (
      parseInt(element.style.right) >
      background.width - element.style.width
    ) {
      // element.remove();
    }
    // Loop through all of the birds and tell them where the pipes are
    txtBirdsAlive.innerText = "Birds Alive: " + birds.length;
    for (let i = 0; i < birds.length; i++) {
      // Tell the birds where the pipes are
      if (index == 0) {
        // temp1 = element.getBoundingClientRect();
        birds[i].setTopPipe(element.getBoundingClientRect());
      } else if (index == 1) {
        // temp2 = element.getBoundingClientRect();
        birds[i].setBottomPipe(element.getBoundingClientRect());
      }
      // console.log('calculateForLook(): ');
      let allPipeSprite = document.querySelectorAll(".pipe_sprite");

      // birds[i].look(inputs, background);
      // birds[i].look(pipe_sprite, background);
      if (allPipeSprite.length > 0)
        birds[i].look([pipe_sprite[0], pipe_sprite[1]]);
    }

    index++;

    // get left, rightm bottom and top of the pipe
    let pipe_sprite_props: DOMRect = element.getBoundingClientRect();

    // get top, left, right, and bottom of the bird
    // for (let i = 0; i < birds.length; i++) {
    //   birds[i].BirdProps();
    // }

    // if the pipe somehow goes too far to the right

    // console.log('Top Pipe Right:', pipe_sprite[0].style.right);

    // if (parseInt(element.style.right) < 0) element.style.display = 'none';
    // else if (parseInt(element.style.right) > 0) element.style.display = 'block';
    if (
      parseInt(element.style.right) < 0 || // If the pipe is off screen on the right side
      parseInt(element.style.right) >
        background.width - 1.5 * parseInt(element.style.width) // off screen on the left side, (Account for the pipe width)
    ) {
      element.remove();
      gameScore += 0.5;
      txtScore.innerText = "Current Score: " + gameScore + "";
      // TODO: Add to the score
    } else {
      // Collision detection with bird and pipes
      // Check collision(Bird hit the pipe)
      for (let i = 0; i < birds.length; i++) {
        if (
          birds[i].checkBackgroundCollision() ||
          birds[i].checkPipeCollision()
        ) {
          // // Hid the bird if there is a collision
          // stops the bird from running function in the bird class
          birds[i].setHasBirdImage(false);
          birds[i].getBirdElement().style.display = "none";
          // remove the bird image element
          // append the bird into daved birds so we can get the best brain from the birds
          savedBirds.push(birds.splice(i, 1)[0]);
        }
      }
      // if all birds are dead then the game is over
      // TODO: if its all ai, when we call for the next generation
      // NOTE: Dont want the game to end FOR TESTING

      if (birds.length === 0) {
        clearPage();
        await nextGeneration();
        // clearPage();
        // clearVariables();
        // NOTE: MIght want to call setup() again

        // Change game state and end the game
        // if collision occurs
        // Set the game to false, will be set to true
        // isPlayingGame = false;
        game_state = "End";
        isPlayingGame = false;
        gameScore = 0;
        txtScore.innerText = "Current Score: " + gameScore + "";
        // When the game ends or there are no more birds

        // game_state = 'Start';
        for (let i = 0; i < requestsIDs.length; i++) {
          cancelAnimationFrame(requestsIDs[i]);
        }

        startGame();

        return;
      } else {
        // Increase the score if player
        // has the successfully dodged the
        // for (let i = 0; i < birds.length; i++) {
        //   birds[i].addScore();
        // }

        //   move the pipe to the left
        let newRight = parseInt(element.style.right) + move_speed;

        element.style.right = newRight + "px";
        whenToCreatePipe(newRight);
      }
    }
  });
  requestsIDs.push(requestAnimationFrame(move));
}

function apply_gravity() {
  if (!isPlayingGame) return;
  if (game_state != "Play") return;

  bird_dy = bird_dy + gravity;
  document.addEventListener("keydown", (e) => {
    // prewssing space uparrow
    if (e.key == "ArrowUp" || e.key == " ") {
      // bird_dy = -7.6;
      bird_dy = -2.5;
    }
  });

  let hitBackground = false;
  let hitPipe = false;
  for (let i = 0; i < birds.length; i++) {
    birds[i].applyGravity(gravity);
  }

  // Collision detection with bird and
  // window top and bottom

  // if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
  //   game_state = "End";
  //   message.innerHTML = "Press Enter To Restart";
  //   message.style.left = "28vw";
  //   return;
  // // }
  // bird.style.top = bird_props.top + bird_dy + "px";
  // bird_props = bird.getBoundingClientRect();
  requestsIDs.push(requestAnimationFrame(apply_gravity));
}
function create_pipe() {
  // if (game_state != 'Play') return;
  // if (!isPlayingGame) return;

  // Create another set of pipes
  // if distance between two pipe has exceeded
  // a predefined value

  // if (pipe_seperation > 115) {
  //   pipe_seperation = 0;

  let pipePosition: Array<number> = setPipeHeight();

  let top_pipe_img: HTMLImageElement = document.createElement("img");
  top_pipe_img.className = "pipe_sprite";
  top_pipe_img.id = "Top_Pipe";
  top_pipe_img.src = "/static/flappbirds/green.png";

  // pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
  top_pipe_img.style.top = "0px";

  top_pipe_img.style.right = "0px";
  top_pipe_img.style.zIndex = "99";
  top_pipe_img.style.position = "absolute";
  top_pipe_img.style.height = pipePosition[0] + "px";
  top_pipe_img.style.width = "150px";
  top_pipe_img.style.color = "black";

  // Append the created pipe element in DOM
  document.getElementById("background")!.appendChild(top_pipe_img);

  // Background Height - (Bottom Height pipe + bird Height)

  let bottom_pipe_img: HTMLImageElement = document.createElement("img");
  bottom_pipe_img.className = "pipe_sprite";
  bottom_pipe_img.id = "Bottom_Pipe";
  bottom_pipe_img.src = "/static/flappbirds/green.png";

  // Top 993px

  bottom_pipe_img.style.bottom = "-0px";
  bottom_pipe_img.style.right = "0px";
  bottom_pipe_img.style.zIndex = "99";
  bottom_pipe_img.style.height = pipePosition[1] + "px";
  bottom_pipe_img.style.width = "150px";
  bottom_pipe_img.style.position = "absolute";

  // Append the created pipe element in DOM
  document.getElementById("background")!.appendChild(bottom_pipe_img);
  // }
  // pipe_seperation++;

  let tempPipes = document.querySelectorAll(".pipe_sprite");

  // console.log('Top Pipe: ', tempPipes[0]);
  // console.log('Top Pipe Rect: ', tempPipes[0].getBoundingClientRect());
  // let rect = tempPipes[0].getBoundingClientRect();
  // for (const key in rect) {
  //   if (typeof rect[key] !== 'function') {
  //     console.log(`${key} : ${rect[key]}`);
  //   }
  // }

  // console.log('TempPipes 1: ', tempPipes[1]);
  // console.log('TempPipes Rect: ', tempPipes[1].getBoundingClientRect());

  // requestAnimationFrame(create_pipe);
  created_pipe = true;
}

async function nextGeneration() {
  // NOTE:commented out for testing
  birds = new Array();
  // Next Generation when the nutton is pressed
  //TODO: make a txt element that updates the current generation

  let BestBird: BirdClass;

  // call fitness
  calculateFitness();

  // check if the user has uploaded model either from their computer, the website, or their browser
  if (loadBest == true && loadedModel != null) {
    loadBest = false;

    // TOTAL = 5;

    for (let i = 0; i < TOTAL; ++i) {
      birds[i] = pickOne(loadedModel);
    }
  } else {
    BestBird = pickOne();
    // BestBird.clearVariables();

    for (let i = 0; i < TOTAL; i++) {
      birds[i] = BestBird;
    }
  }

  for (let i = 0; i < savedBirds.length; i++) {
    savedBirds[i].dispose();
  }

  savedBirds = new Array();
  createdNewBirds == true;
  currentGen++;
  txtCurrGen.innerText = "Current Generation: " + currentGen;
}

function pickOne(model?: any) {
  // Pick a bird that will be used to train the next set of birds
  let index: number = 0;
  // var r = random(1);
  let r: number = Math.random();

  while (r > 0) {
    // NOTE: birds only have fitness when passing pipes
    if (savedBirds.length > 0) {
      if (typeof savedBirds[index] === "undefined") {
        continue;
      }

      r = -savedBirds[index].getFitness();

      index++;
      if (index > savedBirds.length - 1) {
        break;
      }
    }
  }
  index--;
  if (index >= savedBirds.length) index = savedBirds.length - 1;
  else if (index < 0) index = 0;
  // get the best bird
  let bird: BirdClass = savedBirds[index]; // also delete this saved bird, so we can dispose of the whole array

  savedBirds.splice(index, 1);

  // just want ro remove the picked model
  // if (index > -1) {
  //   savedBirds.splice(index, 1);
  // }

  // save best bird
  if (saveBest == true) {
    bird.save(saveBestType);
    // set to false
    saveBest = false;
  }
  // variable of type of BirdClass
  var child: BirdClass;

  if (model)
    // make new bird with brain and model
    child = new BirdClass(bird.getBirdBrain(), null, model);
  else {
    // make new bird with brain
    child = new BirdClass(bird.getBirdBrain());
  }

  // call mutate
  child.mutate();

  return child;
}

function calculateFitness() {
  // calculate fitness of all the birds
  // variable
  var sum: number = 0;
  let tempBirdScore: Array<number> = new Array();
  // loop through all saved birds

  for (let i = 0; i < savedBirds.length; i++) {
    if (!savedBirds[i]) continue;

    tempBirdScore[i] = savedBirds[i].getScore();

    sum += savedBirds[i].getScore();
  }

  for (let j = 0; j < savedBirds.length; j++) {
    if (sum <= 0) {
      savedBirds[j].setFitness(0);
    } else {
      if (typeof savedBirds[j] !== "undefined") {
        savedBirds[j].setFitness(tempBirdScore[j] / sum);
      }
    }
  }
}

async function loadBirdModel(type: number, birdJSON?: any) {
  // load snake model from the browser
  var model;
  var isLoaded = false;

  switch (type) {
    case 0:
      // load model from users browsers local storage
      try {
        model = await tf.loadLayersModel("localstorage://best_bird");
        isLoaded = true;
        isLocalModel = true;
        loadBest = true;
      } catch (err: any) {
        // if there is no saved model
        console.log(err.message);
      }
      break;
    case 1:
      // load model from website
      try {
        model = await tf.loadLayersModel("/static/flappbirds/best_bird.json");
        console.log("Best Bird loaded from website");
        isLoaded = true;
        isWebsiteModel = true;
        loadBest = true;
      } catch (err: any) {
        console.log(err.message);
      }

      break;
    case 2:
      // load model from the users computer
      try {
        model = await tf.loadLayersModel(birdJSON);
        isLoaded = true;
        isWebsiteModel = true;
        loadBest = true;
      } catch (err: any) {
        console.log(err.message);
      }

      break;
    default:
      console.log("Bird Model was not Loaded.");
      break;
  }

  // check if model is a model and a model is loaded
  if (model instanceof tf.Sequential && isLoaded == true) {
    // return model
    return model as tf.Sequential;
  }
}

// Clear the pipes, birds, and reformat the page so another game can be played
function clearPage() {
  document.querySelectorAll(".bird").forEach((e) => {
    e.remove();
  });

  // Clear all of the pipe
  document.querySelectorAll(".pipe_sprite").forEach((e) => {
    e.remove();
  });
}

function whenToCreatePipe(pipeRightPos: number) {
  let pipeWidth = birdWidth * 1.5;

  let totalNumberOfPipes: number = background.width / pipeWidth; // 5.2267

  let extraPipeWidth: number =
    background.width - pipeWidth * Math.floor(totalNumberOfPipes); //144 px width

  let pipePlusExtra =
    pipeWidth + extraPipeWidth / Math.floor(totalNumberOfPipes); // 186

  let count: number = 0;
  // small margin of error so pipe rigth will at some point be within the range

  // TODO: WORK HERE
  let MOE: number = 0;

  if (move_speed >= 3) {
    MOE = Math.floor(move_speed / 2);
  }
  // check if the pipe has move enough to spawn another pipe
  else MOE = move_speed;

  new Promise((resolve) => setTimeout(resolve, 500)).then(() => {
    created_pipe = false;
  });
  if (!created_pipe)
    if (
      pipeRightPos >
      2 * Math.floor(pipePlusExtra) - MOE /*extraPipeWidth - MOE*/
    ) {
      if (
        pipeRightPos <
        2 * Math.floor(pipePlusExtra) + MOE /*extraPipeWidth + MOE*/
      ) {
        create_pipe();
        count++;
      }
    }
  // create_pipe();
}

function setPipeHeight(bph?: number, tph?: number): Array<number> {
  let bottomPipeHeight: any = 0;
  let topPipHeight: any = 0;

  // minimum pipe height in pixel
  let pipeMinHeight: number = 100;

  // mandom number between 10-20
  // Math.floor(Math.random() * 10)+10;

  if (bph != null || typeof bph != "undefined") {
  } else {
    bottomPipeHeight = bph;
    topPipHeight = background.height - bottomPipeHeight - birdHeight * 2;
  }
  if (tph != null || typeof tph != "undefined") {
  } else {
    topPipHeight = tph;
    bottomPipeHeight = background.height - topPipHeight - birdHeight * 2;
  }

  if (
    (tph == null && bph == null) ||
    (typeof bph == "undefined" && typeof tph == "undefined")
  ) {
    let backgroundRandHeight = randomNumber(
      0,
      background.height - (pipeMinHeight * 2 + birdHeight * 2)
    );

    topPipHeight = randomNumber(pipeMinHeight, backgroundRandHeight);

    bottomPipeHeight = background.height - (topPipHeight + birdHeight * 2);
  }

  return [topPipHeight, bottomPipeHeight];
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * max) + min;
}
