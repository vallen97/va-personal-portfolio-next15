"use client";
import React, { useEffect, useRef, useState } from "react";
import { SortAlgorithm as sAlgorithm } from "../../utils/sorting-algorithm";
import Navbar from "@/components/navbar";

type SortMethod =
  | "selection"
  | "bubble"
  | "insert"
  | "quick"
  | "comb"
  | "randomize"
  | "reset";

interface SortAlgoInstance {
  sort: {
    selection: () => void;
    bubble: () => void;
    insert: () => void;
    quick: () => void;
    comb: () => void;
    randomize: () => void;
    reset: () => void;
    setSpeed: (speed: number) => void;
    setArraySize: (size: number) => void;
  };
}

const SORT_OPTIONS: { name: string; method: SortMethod }[] = [
  { name: "Selection Sort", method: "selection" },
  { name: "Bubble Sort", method: "bubble" },
  { name: "Insertion Sort", method: "insert" },
  { name: "Quick Sort", method: "quick" },
  { name: "Comb Sort", method: "comb" },
  { name: "Random Array", method: "randomize" },
  { name: "Reset Array", method: "reset" },
];

export default function SortAlgorithm() {
  const sliderSpeedRef = useRef<HTMLInputElement>(null);
  const sliderArraySizeRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentSpeed, setCurrentSpeed] = useState<number>(5);
  const [currentArraySize, setCurrentArraySize] = useState<number>(25);
  const [algorithm, setAlgorithm] = useState<SortAlgoInstance | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    setAlgorithm(sAlgorithm(canvasRef.current, ctx));
  }, []);

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentSpeed(val);
    if (algorithm) algorithm.sort.setSpeed(Math.pow(val, 3));
  };

  const handleArraySizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentArraySize(val);
    if (algorithm) algorithm.sort.setArraySize(val);
  };

  const handleSortClick = (method: SortMethod) => {
    if (!algorithm) return;
    algorithm.sort[method]();
  };

  return (
    <div className="px-8">
      <Navbar />
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 p-4 mt-3">
        {SORT_OPTIONS.map(({ name, method }) => (
          <button
            className="bg-materialUI-LightOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer text-materialUI-LightPrimaryContainer dark:text-materialUI-DarkPrimaryContainer font-semibold py-2 px-4 rounded"
            id={`btn${name.replace(/ /g, "")}`}
            key={name}
            onClick={() => handleSortClick(method)}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Speed slider */}
      <div className="px-5">
        <label
          className="
      block mb-2 text-sm font-medium 
      text-materialUI-LightPrimaryContainer bg-materialUI-LightOnPrimaryContainer
      dark:text-materialUI-DarkOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer
      rounded-lg px-2 py-1
    "
        >
          Current Speed: {Math.pow(currentSpeed, 3)} ms
        </label>
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
          aria-label="Slider that adjusts the speed of the sort algorithm"
          onChange={handleSpeedChange}
        />
      </div>

      {/* Array size slider */}
      <div className="px-5">
        <label
          className="
      block mb-2 text-sm font-medium 
      text-materialUI-LightPrimaryContainer bg-materialUI-LightOnPrimaryContainer
      dark:text-materialUI-DarkOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer
      rounded-lg px-2 py-1
    "
        >
          Array Size: {currentArraySize}
        </label>
        <input
          ref={sliderArraySizeRef}
          id="arraysize-range"
          type="range"
          min={10}
          max={100}
          value={currentArraySize}
          className="
      w-full h-2 appearance-none rounded-lg cursor-pointer
      bg-gray-300 dark:bg-gray-700
      accent-blue-500 dark:accent-blue-400
      focus:outline-none
    "
          aria-label="Slider that adjusts the number of items to sort"
          onChange={handleArraySizeChange}
        />
      </div>

      {/* Canvas */}
      <div className="grid place-items-center pt-5">
        <canvas ref={canvasRef} height={300} width={300} />
      </div>
    </div>
  );
}
