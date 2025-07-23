"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/SupabaseClient";
import useUserSession from "../../../custom-hooks/useUserSession";

export default function Page() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [Loading, setLoading] = useState(false);
  const router = useRouter();
  const { session } = useUserSession();

  //check auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/login");
      }
    });
  }, [router]);

  const handleUpload = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    //validate inputs
    if (
      !title.trim() ||
      !artist.trim() ||      
      !imageFile ||
      !audioFile
    ) {
      setMessage("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      const timestamp = Date.now();

      //upload the image
      const imagepath = `images/${timestamp}_${imageFile.name}`;
      const { error: imgError } = await supabase.storage
        .from("cover-images")
        .upload(imagepath, imageFile);

      if (imgError) {
        setMessage(imgError.message);
        console.log("Image Error:" + imgError.message);
        setLoading(false);
        return;
      }

      //generate image URL
      const {
        data: { publicUrl: imageUrl },
      } = supabase.storage.from("cover-images").getPublicUrl(imagepath);

      //upload song audio
      const audioPath = `audio/${timestamp}_${audioFile.name}`;
      const { error: audioError } = await supabase.storage
        .from("songs")
        .upload(audioPath, audioFile);

      if (audioError) {
        setMessage(audioError.message);
        console.log("Audio Error:" + audioError.message);
        setLoading(false);
        return;
      }

      //generate song URL
      const {
        data: { publicUrl: audioUrl },
      } = supabase.storage.from("songs").getPublicUrl(audioPath);

      //save songs to table
      const { error: dbError } = await supabase.from("songs").insert({
        title,
        artist,        
        cover_image_url: imageUrl,
        audio_url: audioUrl,
        user_id: session?.user.id,
      });

      if (dbError) {
        setMessage(dbError.message);
        console.log("Table Error:" + dbError.message);
        setLoading(false);
        return;
      }

      setTitle("");
      setArtist("");
      setImageFile(null);
      setAudioFile(null);
      setMessage("Song uploaded successfully!");
      setTimeout(() => {
        router.push("/");
      }, 2000);
      setLoading(false);
    } catch (err) {
      console.log("Catched Error:" + err);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center w-full bg-hover">
      <div className="bg-background flex items-center flex-col px-6 lg:px-12 py-6 rounded-md max-w-[400px] w-[90%]">
        <Image
          width={800}
          height={800}
          src="/images/logo.png"
          alt="logo"
          className="w-11 h-11"
        />
        <h2 className="text-3xl font-bold text-white my-2 mb-8 text-center">
          Upload to Spotify
        </h2>

        <form onSubmit={handleUpload}>
          {message && (
            <p className="bg-primary font-semibold text-center mb-4 py-1">
              {message}
            </p>
          )}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="outline-none border-1 border-neutral-600 p-2 w-full m-auto rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:border-secondary-text"
          />
          <input
            type="text"
            placeholder="Artist Name"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="outline-none border-1 border-neutral-600 p-2 w-full m-auto rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:border-secondary-text"
          />       
          <label htmlFor="audio" className="block py-2 text-secondary-text">
            Audio
          </label>
          <input
            type="file"
            id="audio"
            accept="audio/*"
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              const file = files[0];
              setAudioFile(file);
            }}
            className="outline-none border-1 border-neutral-600 p-2 w-full m-auto rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:border-secondary-text"
          />
          <label htmlFor="cover" className="block py-2 text-secondary-text">
            Cover Image
          </label>
          <input
            type="file"
            id="images"
            accept="image/*"
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              const file = files[0];
              setImageFile(file);
            }}
            className="outline-none border-1 border-neutral-600 p-2 w-full m-auto rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:border-secondary-text"
          />
          {Loading ? (
            <button className="bg-primary py-3 rounded-full w-full font-bold cursor-pointer">
              Uploading...
            </button>
          ) : (
            <button className="bg-primary py-3 rounded-full w-full font-bold cursor-pointer">
              Add Song
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
