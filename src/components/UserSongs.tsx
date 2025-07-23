import Image from "next/image";
import React, { useContext } from "react";
import { supabase } from "../../lib/SupabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Song } from "@/types/song";
import DeleteButton from "./DeleteButton";
import { PlayerContext } from "@/layouts/FrontendLayout";

type UserSongsProps = {
  userId: string | undefined;
};

export default function UserSongs({ userId }: UserSongsProps) {

  const context = useContext(PlayerContext);
  
    if (!context) {
      throw new Error("PlayerContext must be used within a PlayerProvider");
    }
  
    const { setIsMusicPlaying,setQueue,setCurrentIndex } = context;

  const getUserSongs = async () => {
    const { error, data } = await supabase
      .from("songs")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.log("FetchUserSongsError:" + error.message);
    }

    return data;
  };

  const {
    data: songs,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["userSongs"],
    queryFn: getUserSongs,
  });

  const startPlayingSong = (songs: Song[],index:number) => {
      setQueue(songs)    
      setIsMusicPlaying(true);
      setCurrentIndex(index);
    };

  if (isLoading)
    return (
      <div>
        {[...Array(10)].map((i, index) => (
          <div className="flex gap-2 animate-pulse mb-4"key={index}>
            <div className="w-10 h-10 rounded-md bg-hover"></div>
            <div className="h-5 w-[80%] bg-hover rounded-md"></div>
          </div>
        ))}
      </div>
    );

  if (isError)
    return <h1 className="text-center text-white text-2xl">{error.message}</h1>;

  if (songs?.length === 0)
    return (
      <h1 className="text-center text-white text-sm">
        You have no songs in your library
      </h1>
    );

  return (
    <div>
      {songs?.map((song: Song,index) => {
        return (
          <div
             onClick={() => startPlayingSong(songs,index)}
            key={song.id}
            className="group relative flex items-center gap-2 cursor-pointer mb-4 p-2 rounded-lg hover:bg-hover"
          >
            <DeleteButton
              songId={song.id}
              imagePath={song.cover_image_url}
              audioPath={song.audio_url}
            />
            <Image
              src={song.cover_image_url}
              alt="cover-image"
              width={300}
              height={300}
              className="object-cover w-10 h-10 rounded-md"
            />
            <div>
              <p className="text-primary-text font-semibold">{song.title}</p>
              <p className="text-secondary-text text-sm">By {song.artist}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
