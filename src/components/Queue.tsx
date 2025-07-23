import { PlayerContext } from "@/layouts/FrontendLayout";
import { Song } from "@/types/song";
import Image from "next/image";
import React, { useContext } from "react";

export default function Queue() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("PlayerContext must be used within a PlayerProvider");
  }

  const {
    queue,
    setQueue,
    setIsMusicPlaying,
    setCurrentIndex,
    currentMusic,
    queueModal,
    currentIndex,
  } = context;

  const startPlayingSong = (songs: Song[], index: number) => {
    setQueue(songs);
    setIsMusicPlaying(true);
    setCurrentIndex(index);
  };

  if (!queueModal) return null;

  return (
    <div className="fixed top-15 right-5 z-50 max-w-[300px] w-full h-[75vh] bg-black border-1 border-hover p-4 overflow-y-auto scrollbar-hide rounded-md">
      <h2 className="text-white font-bold">Queue</h2>
      <div className="mt-8">
        <h2 className="text-white font-bold mb-3">Now Playing</h2>
        <div className="group relative flex items-center gap-2 cursor-pointer mb-4 p-2 rounded-lg hover:bg-hover">
          {currentMusic && (
            <Image
              src={currentMusic?.cover_image_url}
              alt="cover-image"
              width={300}
              height={300}
              className="object-cover w-10 h-10 rounded-md"
            />
          )}
          <div>
            <p className="text-primary font-semibold">{currentMusic?.title}</p>
            <p className="text-secondary-text text-sm">
              By {currentMusic?.artist}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-white font-bold mb-3">Queue List</h2>
        {queue.map((item: Song, index) => {
          return (
            <div
              onClick={() => startPlayingSong(queue, index)}
              key={item.id}
              className="group relative flex items-center gap-2 cursor-pointer mb-4 p-2 rounded-lg hover:bg-hover"
            >
              <Image
                src={item.cover_image_url}
                alt="cover-image"
                width={300}
                height={300}
                className="object-cover w-10 h-10 rounded-md"
              />
              <div>
                <p
                  className={`font-semibold ${
                    currentIndex === index ? "text-primary" : "text-primary-text"
                  }`}
                >
                  {item.title}
                </p>
                <p className="text-secondary-text text-sm">By {item.artist}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
