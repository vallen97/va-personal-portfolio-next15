"use client";
import React, { useState } from "react";
import Image from "next/image";

interface Slide {
  image: string | null;
  alt?: string;
}

interface ImageSliderProps {
  slides: Slide[];
}

/**
 * Displays a carousel slider with images.
 * Falls back to a placeholder if an image is missing.
 */
export const ImageSlider: React.FC<ImageSliderProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  const numSlides = slides.length;
  const goToSlide = (idx: number) => setCurrent(idx);
  const goPrev = () =>
    setCurrent((prev) => (prev === 0 ? numSlides - 1 : prev - 1));
  const goNext = () =>
    setCurrent((prev) => (prev === numSlides - 1 ? 0 : prev + 1));

  // Early rendering for empty slides array
  if (numSlides === 0) {
    return (
      <div className="flex items-center justify-center h-56 rounded-lg bg-gray-100 dark:bg-gray-800">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <div
      id="default-carousel"
      className="relative w-full"
      data-carousel="slide"
    >
      {/* Carousel wrapper */}
      <div className="relative h-56 overflow-hidden rounded-lg">
        {slides.map((slide, idx) => (
          <div
            key={slide.image ?? `slide-${idx}`}
            className={`duration-700 ease-in-out absolute inset-0 transition-opacity ${
              idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            data-carousel-item={idx === current ? "active" : undefined}
            aria-hidden={idx !== current}
          >
            <Image
              src={
                slide.image
                  ? slide.image.endsWith(".PNG")
                    ? slide.image
                    : `${slide.image}.PNG`
                  : "https://fakeimg.pl/800x451"
              }
              alt={slide.alt ?? `Slide ${idx + 1}`}
              fill
              style={{ objectFit: "contain" }}
              className="block w-full h-full"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>
      {/* Indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`w-3 h-3 rounded-full ${
              idx === current ? "bg-blue-500" : "bg-gray-300"
            }`}
            aria-current={idx === current}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => goToSlide(idx)}
          />
        ))}
      </div>
      {/* Controls */}
      <button
        type="button"
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={goPrev}
        aria-label="Previous Slide"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={goNext}
        aria-label="Next Slide"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default React.memo(ImageSlider);
