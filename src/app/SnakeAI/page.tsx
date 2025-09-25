"use client";

import React, { useEffect, useRef, useState } from "react";

import { Game } from "../../utils/snakegame/game";
import Navbar from "@/components/navbar";
import Dropdown from "@/components/dropdown";

export default function SnakeAIPage() {
  // Canvas and slider refs, strongly typed
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sliderSpeedRef = useRef<HTMLInputElement>(null);
  const sliderSnakeCountRef = useRef<HTMLInputElement>(null);

  // Label refs for the game's text outputs
  const labelGen = useRef<HTMLSpanElement>(null);
  const labelSnakeScore = useRef<HTMLSpanElement>(null);
  const labelSnakesAlive = useRef<HTMLSpanElement>(null);

  // State for speed, snake count, and main game logic
  const [currentSpeed, setCurrentSpeed] = useState<number>(5);
  const [numberOfSnakes, setNumberOfSnakes] = useState<number>(5);
  const [snakeGame, setSnakeGame] = useState<any>(null);
  const [isGameLoaded, setIsGameLoaded] = useState<boolean>(false);

  // Initialize game logic on mount
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    setSnakeGame(
      Game(
        canvasRef.current,
        ctx,
        labelGen.current,
        labelSnakeScore.current,
        labelSnakesAlive.current
      )
    );
  }, []);

  // Handlers for sliders (no use of any)
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    setCurrentSpeed(newVal);
    if (snakeGame) snakeGame.setGameSpeed(newVal * 10);
  };

  const handleSnakeCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    setNumberOfSnakes(newVal);
    if (snakeGame) snakeGame.setSnakePlayers(newVal);
  };

  return (
    <div>
      <Navbar />

      {/* Save and load menus */}
      <div className="pt-4 pb-10 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 place-items-center mt-3">
        {isGameLoaded && (
          <div className="lg:col-start-1 text-center w-56">
            <Dropdown
              mainButtonText="Save Snake to"
              arrDropdown={["Local Storage"]}
              // class={snakeGame}
              // save={true}
              // isBird={false}
            />
          </div>
        )}
        <div className="lg:col-start-3 lg:col-end-6 w-56 text-center">
          <Dropdown
            mainButtonText="Load Snake From"
            arrDropdown={["Local Storage", "Website"]}
            // class={snakeGame}
            // save={false}
            // isBird={false}
          />
        </div>
      </div>

      {/* Start button */}
      {!isGameLoaded && (
        <div className="py-4 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          <button
            className="bg-materialUI-LightOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer text-materialUI-LightPrimaryContainer dark:text-materialUI-DarkPrimaryContainer font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={() => {
              if (snakeGame && canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d");
                if (ctx) {
                  snakeGame.start(ctx);
                  setIsGameLoaded(true);
                }
              }
            }}
          >
            Start
          </button>
        </div>
      )}

      {/* Gen and next button */}
      <div className="py-4 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        <span
          className="text-materialUI-LightOnPrimaryContainer bg-materialUI-LightPrimaryContainer dark:text-materialUI-DarkOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer lg:col-start-1 text-xs font-semibold inline-block py-1 px-2 uppercase rounded mr-1"
          ref={labelGen}
        >
          Current Generation: 0
        </span>
        <button
          className="bg-materialUI-LightOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer text-materialUI-LightPrimaryContainer dark:text-materialUI-DarkPrimaryContainer lg:col-start-3 font-semibold py-2 px-4 border rounded"
          onClick={() => {
            if (snakeGame) snakeGame.nextGen();
          }}
        >
          Next Generation
        </button>
      </div>

      {/* Speed slider value */}
      <div className="py-4 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        <span className="text-materialUI-LightOnPrimaryContainer bg-materialUI-LightPrimaryContainer dark:text-materialUI-DarkOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer col-span-1 text-xs font-semibold inline-block py-1 px-2 uppercase rounded mr-1">
          Current Speed: {currentSpeed * 10} ms
        </span>
      </div>
      {/* Speed slider */}
      <div
        className="
      block mb-2 text-sm font-medium 
      text-materialUI-LightPrimaryContainer bg-materialUI-LightOnPrimaryContainer
      dark:text-materialUI-DarkOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer
      rounded-lg px-2 py-1
    "
      >
        <input
          ref={sliderSpeedRef}
          id="speed-range"
          type="range"
          min={1}
          max={10}
          value={currentSpeed}
          className="
      w-full h-2 appearance-none rounded-lg cursor-pointer
      bg-gray-300 dark:bg-gray-700
      accent-blue-500 dark:accent-blue-400
      focus:outline-none
    "
          aria-label="Slider that adjusts the speed of the snakes"
          onChange={handleSpeedChange}
        />
      </div>

      {/* Snakes alive count */}
      <div className="py-4 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        <span
          ref={labelSnakesAlive}
          className="text-materialUI-LightOnPrimaryContainer bg-materialUI-LightPrimaryContainer dark:text-materialUI-DarkOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer col-span-1 text-xs font-semibold inline-block py-1 px-2 uppercase rounded mr-1"
        >
          Snakes Alive: {numberOfSnakes}
        </span>
      </div>
      {/* Snake count slider */}
      <div
        className="
      block mb-2 text-sm font-medium 
      text-materialUI-LightPrimaryContainer bg-materialUI-LightOnPrimaryContainer
      dark:text-materialUI-DarkOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer
      rounded-lg px-2 py-1
    "
      >
        <input
          ref={sliderSnakeCountRef}
          id="snakecount-range"
          type="range"
          min={1}
          max={100}
          value={numberOfSnakes}
          className="
      w-full h-2 appearance-none rounded-lg cursor-pointer
      bg-gray-300 dark:bg-gray-700
      accent-blue-500 dark:accent-blue-400
      focus:outline-none
    "
          aria-label="Slider that adjusts the number of snakes"
          onChange={handleSnakeCountChange}
        />
      </div>

      {/* Score */}
      <div className="py-4 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        <span
          ref={labelSnakeScore}
          className="text-materialUI-LightOnPrimaryContainer bg-materialUI-LightPrimaryContainer dark:text-materialUI-DarkOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer col-span-1 text-xs font-semibold inline-block py-1 px-2 uppercase rounded mr-1"
        >
          Current Score: 0
        </span>
      </div>

      {/* Canvas */}
      <div className="py-4 grid place-items-center">
        <canvas ref={canvasRef} width={300} height={300} />
      </div>
    </div>
  );
}
