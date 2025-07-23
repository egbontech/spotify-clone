import { supabase } from "../SupabaseClient";

const LogoutUser = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log("Logout Error:", error.message);
    return { error: error.message };
  }
};


export default LogoutUser;