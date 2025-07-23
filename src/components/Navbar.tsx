"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { GoSearch } from "react-icons/go";
import { MdHomeFilled } from "react-icons/md";
import useUserSession from "../../custom-hooks/useUserSession";
import { useRouter } from "next/navigation";
import LogoutUser from "../../lib/auth/LogoutUser";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    const result = await LogoutUser();

    if (!result?.error) {
      router.push("/");
    }
  };
  const {session,loading} = useUserSession();

  if(loading) return null;
  return (
    <nav className="h-15  border-b-2 flex justify-between items-center px-6 fixed top-0 left-0 w-full bg-black z-100">
      <div className="flex items-center gap-6">
        <Image
          width={800}
          height={800}
          src="/images/logo.png"
          alt="logo"
          className="w-9 h-9"
        />
        <Link
          href="/"
          className="bg-background w-11 h-11 grid place-items-center text-white text-3xl rounded-full"
        >
          <MdHomeFilled />
        </Link>
        <div className="bg-background hidden lg:flex items-center h-11 w-90 px-3 gap-3 text-primary-text rounded-full">
          <GoSearch className="text-text-primary shrink-0" size={25} />
          <input
            type="text"
            placeholder="What do you want to play?"
            className="h-full w-full outline-none placeholder:text-text-primary"
          />
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="lg:flex hidden gap-2 text-secondary-text font-bold border-r-2 border-secondary-text pr-6">
          <a href="#" className="hover:text-primary-text">
            Premium
          </a>
          <a href="#" className="hover:text-primary-text">
            Support
          </a>
          <a href="#" className="hover:text-primary-text">
            Download
          </a>
        </div>
        <div>
          {session ? (
            <button 
            onClick={handleLogout}
            className="cursor-pointer h-11 px-8 bg-white text-gray-950 rounded-full font-bold grid place-items-center hover:bg-secondary-text hover:scale-105">
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="h-11 px-8 bg-white text-gray-950 rounded-full font-bold grid place-items-center hover:bg-secondary-text hover:scale-105"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
