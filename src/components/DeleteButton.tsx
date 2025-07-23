import React from "react";
import { FaTrash } from "react-icons/fa6";
import { supabase } from "../../lib/SupabaseClient";
import { useQueryClient } from "@tanstack/react-query";

type DeleteButtonProp = {
  songId: string;
  imagePath: string;
  audioPath: string;
};

export default function DeleteButton({
  songId,
  audioPath,
  imagePath,
}: DeleteButtonProp) {
  const queryClient = useQueryClient();

  const deleteSong = async () => {
    //delete the image
    const { error: imgError } = await supabase.storage
      .from("cover-images")
      .remove([imagePath]);

    if (imgError) {
      console.log("ImageError:" + imgError.message);
      return;
    }

    // delete the audio
    const { error: audioError } = await supabase.storage
      .from("songs")
      .remove([audioPath]);

    if (audioError) {
      console.log("AudioError:" + audioError.message);
      return;
    }

    //delete song from table
    const { error: deleteError } = await supabase
      .from("songs")
      .delete()
      .eq("id", songId);

    if (deleteError) {
      console.log("DeleteError:" + deleteError.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["userSongs"] });
    queryClient.invalidateQueries({ queryKey: ["allSongs"] });
  };
  return (
    <button
      onClick={() => deleteSong()}
      className="text-secondary-text absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hidden group-hover:block"
    >
      <FaTrash />
    </button>
  );
}
