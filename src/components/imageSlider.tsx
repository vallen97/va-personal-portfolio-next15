"use client";
import React from "react";
import { Carousel } from "flowbite-react";
import Image from "next/image";

interface Slide {
  image: string | null;
}

interface ImageSliderProps {
  slides: Slide[];
}

/**
 * Renders a carousel slider with images.
 * Falls back to a placeholder if a slide image is missing.
 */
export const ImageSlider: React.FC<ImageSliderProps> = ({ slides }) => {
  // Ensure fallback for empty slides array
  if (!slides || slides.length === 0) {
    return (
      <div
        className="w-full flex justify-center items-center"
        style={{ height: 225 }}
      >
        <Image
          src="https://fakeimg.pl/800x451"
          alt="No images available"
          height={451}
          width={800}
        />
      </div>
    );
  }

  return (
    <Carousel
      slideInterval={5000}
      pauseOnHover
      id={`carousel-${slides[0]?.image ?? "fallback"}`}
      style={{ height: 225 }}
      className="rounded"
    >
      {slides.map((slide, idx) => (
        <div key={slide.image ?? `placeholder-${idx}`} style={{ height: 225 }}>
          <Image
            src={
              slide.image ? `${slide.image}.PNG` : "https://fakeimg.pl/800x451"
            }
            alt={slide.image ? `Slide ${idx + 1}` : "Placeholder image"}
            height={451}
            width={800}
            priority={idx === 0}
            className="object-cover w-full h-full"
          />
        </div>
      ))}
    </Carousel>
  );
};

export default React.memo(ImageSlider);
