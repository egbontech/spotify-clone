import { supabase } from "../SupabaseClient";


const LoginUser = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Login Error:", error.message);
      return { error: error.message };
    }
  } catch (err) {
    console.log("Unexpected Error:", err);
    return { error: "Something went wrong." };
  }
};

export default LoginUser;
