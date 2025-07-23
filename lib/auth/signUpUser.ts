import { supabase } from "../SupabaseClient";


const signUpUser = async (name: string, email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      console.log("Signup Error:", error.message);
      return { error: error.message };
    }
  } catch (err) {
    console.log("Unexpected Error:", err);
    return { error: "Something went wrong." };
  }
};

export default signUpUser;
