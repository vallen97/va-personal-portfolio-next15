"use client";

import React from "react";

import { CardProps } from "../types/card";
import Navbar from "@/components/navbar";
import Card from "@/components/card";

/** Define the array only once, as this content is static. */
const PROJECTS: CardProps[] = [
  {
    imageURKIDs: 0,
    imageAlt: "Song Comparison app Images",
    cardTitle: "Song Comparison",
    cardDescription:
      "This application was made in python and it compares the lyrics of two different songs. When searching for a song, the user can either search for an artist, song, or partial lyrics, and the top ten results will be returned to the user. Once both songs are selected a graph is made for the most common words used by either song. Those lyrics are filtered through a list of the most common words in English. Finally, a summary of both lyrics is made, which is determined to be the most important part of the lyrics.",
    buttonTitle: "View Project",
    buttonLink: "https://github.com/vallen97/song_comparison",
    externalLink: true,
  },
  {
    imageURKIDs: 1,
    imageAlt: "Local Online Game images",
    cardTitle: "Local Online Game",
    cardDescription:
      "This project is a game made with the Unity engine. The core mechanics are simple: each player has three lives and can move up, left, or right. The purpose of this game is to have local online multiplayer, where up to four players can play together. There is a host, which each user needs to connect to, and each player is color-coded. Once there is only one player left, they are the winner and everyone is sent back to the main menu.",
    buttonTitle: "View Project",
    buttonLink: "https://github.com/vallen97/local_online_game",
    externalLink: true,
  },
  {
    imageURKIDs: 2,
    imageAlt: "Snake AI images",
    cardTitle: "Snake AI",
    cardDescription:
      "This application is a snake game that uses machine learning to play the game.",
    buttonTitle: "View Snake AI",
    buttonLink: "/SnakeAI",
    externalLink: false,
  },
  {
    imageURKIDs: 3,
    imageAlt: "Sorting Algorithms Images",
    cardTitle: "Visualizing Sorting Algorithms",
    cardDescription:
      "This application is used to visualize different sorting algorithms.",
    buttonTitle: "Start Visualizing",
    buttonLink: "/SortAlgorithm",
    externalLink: false,
  },
  {
    imageURKIDs: 4,
    imageAlt: "Bird AI images",
    cardTitle: "Flappy Birds AI",
    cardDescription:
      "This application is the Flappy Birds game that uses machine learning to play.",
    buttonTitle: "View Flappy Birds AI",
    buttonLink: "/FlappyBirds",
    externalLink: false,
  },
  {
    imageURKIDs: 5,
    imageAlt: "Song Request app images",
    cardTitle: "Song Requesting",
    cardDescription:
      "This app is for a performer that takes song requests, allowing them to create, read, and delete submissions.",
    buttonTitle: "View Song Request App",
    buttonLink: "https://song-request-t3.vercel.app/",
    externalLink: true,
  },
];

export default function HomePage() {
  return (
    <div className="px-1">
      <Navbar />
      <main className="flex flex-col justify-center mt-3">
        <div className="h-auto grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 sm:place-items-center">
          {PROJECTS.map((project, idx) => (
            <Card
              key={project.cardTitle + idx}
              carouselImages={project.imageURKIDs}
              imageAlt={`${project.imageAlt} ${idx}`}
              cardTitle={project.cardTitle}
              cardDescription={project.cardDescription}
              buttonTitle={project.buttonTitle}
              buttonLink={project.buttonLink}
              externalLink={project.externalLink}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

/*
  carouselImages: number;
  imageAlt: string;
  cardTitle: string;
  cardDescription: string;
  buttonTitle: string;
  buttonLink: string;
  externalLink: boolean;
*/
