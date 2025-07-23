"use client";
import Link from "next/link";
import React, { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { MdOutlineLibraryMusic } from "react-icons/md";
import useUserSession from "../../custom-hooks/useUserSession";
import UserSongs from "./UserSongs";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading, session } = useUserSession();
  const user_id = session?.user.id;

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  if (loading)
    return (
      <aside
        className={`fixed left-2 top-15 bg-background w-75 rounded-lg h-[90vh] p-2 overflow-y-auto scrollbar-hide transform  lg:translate-x-0 z-30 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {[...Array(10)].map((i, index) => (
            <div className="flex gap-2 animate-pulse mb-4" key={index}>
              <div className="w-10 h-10 rounded-md bg-hover"></div>
              <div className="h-5 w-[80%] bg-hover rounded-md"></div>
            </div>
          ))}
        </div>
      </aside>
    );

  return (
    <>
      {session ? (
        <div>
          <button
            className="fixed bottom-5 left-5 bg-black w-12 h-12 grid lg:hidden place-items-center  text-white rounded-full z-50 cursor-pointer "
            onClick={toggleSidebar}
          >
            <MdOutlineLibraryMusic />
          </button>
          <aside
            className={`fixed left-2 top-15 bg-background w-75 rounded-lg h-[90vh] p-2 overflow-y-auto scrollbar-hide transform  lg:translate-x-0 z-30 transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-between text-primary-text items-center p-2 mb-4">
              <h2 className="font-bold">Your Library</h2>
              <Link href="/upload-song">
                <LuPlus size={20} />
              </Link>
            </div>
            <UserSongs userId={user_id} />
          </aside>
        </div>
      ) : (
        <>
          <div>
            <aside
              className={`fixed left-2 top-15 bg-background w-75 rounded-lg h-[90vh] p-2 overflow-y-auto scrollbar-hide transform  lg:translate-x-0 z-30 transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="text-center py-8">
                <Link
                  href="/login"
                  className="bg-white px-6 py-2 rounded-full font-semibold hover:bg-secondary-text"
                >
                  Login
                </Link>
                <p className="mt-4 text-white">Login to view your library</p>
              </div>
            </aside>
          </div>
        </>
      )}
    </>
  );
}
