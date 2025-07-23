"use client";
import MusicPlayer from "@/components/MusicPlayer";
import Navbar from "@/components/Navbar";
import Queue from "@/components/Queue";
import Sidebar from "@/components/Sidebar";
import { Song } from "@/types/song";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { createContext, useEffect, useState } from "react";

type PlayerContextType = {
  currentMusic: Song | null;
  setCurrentMusic: React.Dispatch<React.SetStateAction<Song | null>>;
  isMusicPlaying: boolean;
  setIsMusicPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  queue: Song[];
  setQueue: (songs: Song[]) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  queueModal: boolean;
  setQueueModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PlayerContext = createContext<PlayerContextType | undefined>(
  undefined
);

export default function FrontendLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = new QueryClient();
  const [currentMusic, setCurrentMusic] = useState<Song | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [queueModal, setQueueModal] = useState(false);

  useEffect(() => {
    if (queue.length > 0 && currentIndex >= 0 && currentIndex < queue.length) {
      setCurrentMusic(queue[currentIndex]);
    }
  }, [currentIndex, queue]);

  const playNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="min-h-screen">
      <QueryClientProvider client={queryClient}>
        <PlayerContext.Provider
          value={{
            currentMusic,
            setCurrentMusic,
            isMusicPlaying,
            setIsMusicPlaying,
            queue,
            setQueue,
            currentIndex,
            setCurrentIndex,
            playPrevious,
            playNext,
            queueModal,
            setQueueModal,
          }}
        >
          <Navbar />
          {isMusicPlaying && <MusicPlayer />}
          <main>
            <Sidebar />
            <Queue />
            {children}
          </main>
        </PlayerContext.Provider>
      </QueryClientProvider>
    </div>
  );
}
