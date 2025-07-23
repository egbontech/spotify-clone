"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/SupabaseClient";
import signUpUser from "../../../lib/auth/signUpUser";

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage("All fields are required!");
      return;
    }

    const result = await signUpUser(name, email, password);
    if (result?.error) {
      setMessage(result.error);
    } else {
      setMessage("Signup Successful");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push("/");
      }
    });
  }, [router]);

  return (
    <div className="h-screen flex justify-center items-center w-full bg-hover">
      <div className="bg-background flex items-center flex-col p-12 rounded-md max-w-[400px] w-[90%]">
        <Image
          width={800}
          height={800}
          src="/images/logo.png"
          alt="logo"
          className="w-11 h-11"
        />
        <h2 className="text-3xl font-bold text-white my-2 mb-8 text-center">
          Sign up to Spotify
        </h2>

        <form onSubmit={handleSignUp}>
          {message && (
            <p className="bg-primary font-semibold text-center mb-4 py-1">
              {message}
            </p>
          )}
          <input
            type="text"
            placeholder="Your Name"
            className="outline-none border-1 border-neutral-600 p-2 w-full m-auto rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:border-secondary-text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your Email"
            className="outline-none border-1 border-neutral-600 p-2 w-full m-auto rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:border-secondary-text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your Password"
            className="outline-none border-1 border-neutral-600 p-2 w-full m-auto rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:border-secondary-text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-primary py-3 rounded-full w-full font-bold cursor-pointer">
            Continue
          </button>
          <div className="text-secondary-text text-center my-6">
            <span>Already have an account?</span>
            <Link
              href="login"
              className="ml-2 text-white underline hover:text-primary"
            >
              Log in now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
