"use client";
import React, { useContext } from "react";
import { IoMdPlay } from "react-icons/io";
import { supabase } from "../../lib/SupabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Song } from "@/types/song";
import Image from "next/image";
import { PlayerContext } from "@/layouts/FrontendLayout";

export default function AllSongs() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("PlayerContext must be used within a PlayerProvider");
  }

  const { setIsMusicPlaying,setQueue,setCurrentIndex} = context;
  const getAllSongs = async () => {
    const { data, error } = await supabase.from("songs").select("*");

    if (error) {
      console.log("FetchAllSongsError:" + error.message);
    }

    return data;
  };

  const {
    data: songs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allSongs"],
    queryFn: getAllSongs,
  });

  const startPlayingSong = (songs: Song[],index:number) => {
    setQueue(songs)    
    setIsMusicPlaying(true);
    setCurrentIndex(index);    
  };

  if (isLoading)
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-pulse">
        {[...Array(15)].map((i, index) => (
          <div key={index}>
            <div className="w-full h-50 object-cover rounded-md bg-hover mb-2"></div>
            <div className="h-3 w-[80%] bg-hover rounded-md"></div>
          </div>
        ))}
      </div>
    );

  if (isError)
    return <h1 className="text-center text-white text-2xl">{error.message}</h1>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
      {songs?.map((song: Song,index) => {
        return (
          <div
            onClick={() => startPlayingSong(songs,index)}
            key={song.id}
            className="bg-background p-3 cursor-pointer rounded-md hover:bg-hover relative group"
          >
            <button
              className="bg-primary w-12 h-12 rounded-full grid place-items-center absolute bottom-8 right-5 cursor-pointer
                 opacity-0 group-hover:opacity-100 group-hover:bottom-18
                  transition-all duration-300 ease-in-out"
            >
              <IoMdPlay size={22} />
            </button>
            <Image
              src={song.cover_image_url}
              alt="cover-image"
              width={500}
              height={500}
              className="w-full h-50 object-cover rounded-md"
            />
            <div className="mt-2">
              <p className="text-primary-text font-semibold">{song.title}</p>
              <p className="text-secondary-text text-sm">By {song.artist}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
