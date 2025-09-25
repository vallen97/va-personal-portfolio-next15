"use client";

import Navbar from "@/components/navbar";
import React, { useEffect, useRef, useState } from "react";
import { flappyGame as game } from "../../utils/flappybirdgame/flappGame";
import Dropdown from "@/components/dropdown";

/**
 * Props and state for the Flappy Birds AI game page.
 * Manages game instance and UI refs for gen/score/alive birds.
 */
function FlappyBirdsPage() {
  // DOM refs for text labels, correctly typed
  const labelCurrentGen = useRef<HTMLSpanElement>(null);
  const labelCurrentScore = useRef<HTMLSpanElement>(null);
  const labelCurrentBirdsAlive = useRef<HTMLSpanElement>(null);

  // Store game instance and running state
  const [flappyBirdGame, setFlappyBirdGame] = useState<any>(null);
  const [isGameLoaded, setIsGameLoaded] = useState(false);

  // Initialize game and pass refs on mount
  useEffect(() => {
    setFlappyBirdGame(
      game(
        labelCurrentGen.current,
        labelCurrentScore.current,
        labelCurrentBirdsAlive.current
      )
    );
  }, []);

  return (
    <div>
      <Navbar />
      <div className="pt-4 pb-10 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 place-items-center mt-3">
        {isGameLoaded && (
          <div className="lg:col-start-1 text-center w-56">
            <Dropdown
              mainButtonText="Save Bird to"
              arrDropdown={["Local Storage"]}
              // class={flappyBirdGame}
              // save={true}
              // isBird={true}
            />
          </div>
        )}
        <div className="lg:col-start-3 text-center w-56">
          <Dropdown
            mainButtonText="Load Bird From"
            arrDropdown={["Local Storage", "Website"]}
            // class={flappyBirdGame}
            // save={false}
            // isBird={true}
          />
        </div>
      </div>

      {!isGameLoaded && (
        <div className="py-4 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          <button
            className="bg-materialUI-LightOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer text-materialUI-LightPrimaryContainer dark:text-materialUI-DarkPrimaryContainer font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={() => {
              if (flappyBirdGame) {
                flappyBirdGame.start();
                setIsGameLoaded(true);
              }
            }}
          >
            Start
          </button>
        </div>
      )}

      <div className="py-4 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        <span
          ref={labelCurrentGen}
          className="text-materialUI-LightOnPrimaryContainer bg-materialUI-LightPrimaryContainer dark:text-materialUI-DarkOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer lg:col-start-1 text-xs font-semibold inline-block py-1 px-2 uppercase rounded mr-1"
        >
          Current Generation: 0
        </span>
        <button
          className="bg-materialUI-LightOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer text-materialUI-LightPrimaryContainer dark:text-materialUI-DarkPrimaryContainer lg:col-start-3 font-semibold py-2 px-4 border rounded"
          onClick={() => {
            if (flappyBirdGame) flappyBirdGame.nextGen();
          }}
        >
          Next Generation
        </button>
      </div>
      <div className="py-4 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        <span
          ref={labelCurrentScore}
          className="text-materialUI-LightOnPrimaryContainer bg-materialUI-LightPrimaryContainer dark:text-materialUI-DarkOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer lg:col-start-1 text-xs font-semibold inline-block py-1 px-2 uppercase rounded mr-1"
        >
          Current Score: 0
        </span>
      </div>
      <div className="py-4 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        <span
          ref={labelCurrentBirdsAlive}
          className="text-materialUI-LightOnPrimaryContainer bg-materialUI-LightPrimaryContainer dark:text-materialUI-DarkOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer lg:col-start-1 text-xs font-semibold inline-block py-1 px-2 uppercase rounded mr-1"
        >
          Birds Alive: 10
        </span>
      </div>

      <div
        className="my-4 mx-2 grid grid-cols-1 place-items-center"
        style={{ height: "100vh", width: "95vw" }}
        id="game"
      >
        <div
          id="background"
          className="background content-center border-black"
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "skyblue",
            zIndex: 1,
            position: "relative",
          }}
        ></div>

        <div
          className="message"
          style={{
            position: "relative",
            zIndex: 10,
            height: "2vh",
            fontSize: "2vh",
            fontWeight: 100,
            color: "black",
            top: 0,
            left: 0,
          }}
        ></div>
      </div>
    </div>
  );
}

export default FlappyBirdsPage;
