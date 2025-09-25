import Link from "next/link";
import React, { useState, useMemo } from "react";
import compareSongsImageData from "@/ImagePaths/compareSongsImageData";
import localGameImageData from "@/ImagePaths/localGameImageData";
import snakeImageData from "@/ImagePaths/snakeImageData";
import sortAlgorithmImageData from "@/ImagePaths/sortAlgorithmImageData";
import flappyImageData from "@/ImagePaths/flappyImageData";
import songRequestImageData from "@/ImagePaths/songRequestImageData";
import ImageSlider from "./imageSlider";

// List of all possible image arrays for strict TS/prop control
const IMAGE_DATASETS = [
  compareSongsImageData,
  localGameImageData,
  snakeImageData,
  sortAlgorithmImageData,
  flappyImageData,
  songRequestImageData,
] as const;

export interface CardProps {
  carouselImages: number;
  imageAlt: string;
  cardTitle: string;
  cardDescription: string;
  buttonTitle: string;
  buttonLink: string;
  externalLink: boolean;
}

/**
 * The Card component renders a themed card with an image slider,
 * truncated/expandable description, and a dynamic action button.
 */
export const Card: React.FC<CardProps> = ({
  carouselImages,
  imageAlt,
  cardTitle,
  cardDescription,
  buttonTitle,
  buttonLink,
  externalLink,
}) => {
  // Controls show more/less for description
  const [showMore, setShowMore] = useState(false);

  // Memoize and validate image data to prevent errors and recomputation
  const imgArrays = useMemo(() => {
    if (carouselImages >= 0 && carouselImages < IMAGE_DATASETS.length) {
      return IMAGE_DATASETS[carouselImages];
    }
    return [];
  }, [carouselImages]);

  // Card description length threshold
  const DESC_LIMIT: number = 125;

  // Render action button, using correct link type
  const ActionButton = () => (
    <Link
      href={buttonLink}
      target={externalLink ? "_blank" : undefined}
      rel={externalLink ? "noopener noreferrer" : undefined}
      className="bg-materialUI-LightOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer text-materialUI-LightPrimaryContainer dark:text-materialUI-DarkPrimaryContainer font-semibold rounded shadow px-4 py-2 hover:bg-blue-500 hover:text-white border border-blue-500 hover:border-transparent"
    >
      {buttonTitle}
    </Link>
  );

  // Main component UI
  return (
    <div className="mt-4 bg-materialUI-LightPrimary dark:bg-materialUI-DarkOnBackground border-materialUI-LightOnSurfaceVariant dark:border-materialUI-DarkOnSurfaceVariant max-w-sm rounded overflow-hidden shadow-lg border-2 border-sky-500 min-h-[475px] flex flex-col">
      {/* Image slider */}
      <div className="m-3" style={{ height: 225, backgroundColor: "black" }}>
        <ImageSlider slides={imgArrays} />
      </div>
      {/* Card content */}
      <div className="px-6 py-4 flex-1 flex flex-col">
        <div className="text-materialUI-LightBackground dark:text-materialUI-DarkBackground font-bold text-xl mb-2">
          {cardTitle}
        </div>
        <p className="text-materialUI-LightBackground dark:text-materialUI-DarkBackground text-base">
          {showMore ? cardDescription : cardDescription.slice(0, DESC_LIMIT)}
          {cardDescription.length > DESC_LIMIT && (
            <button
              className="ml-2 bg-materialUI-LightOnPrimaryContainer dark:bg-materialUI-DarkPrimaryContainer text-materialUI-LightPrimaryContainer dark:text-materialUI-DarkPrimaryContainer font-semibold rounded shadow px-2 py-1"
              onClick={() => setShowMore((val) => !val)}
              aria-expanded={showMore}
              aria-label={
                showMore ? "Show less description" : "Show more description"
              }
            >
              {showMore ? "Show less..." : "Show more..."}
            </button>
          )}
        </p>
        <div className="mt-4">
          <ActionButton />
        </div>
      </div>
    </div>
  );
};

// Pure memoization for performance, handles only true prop changes.
export default React.memo(Card);
