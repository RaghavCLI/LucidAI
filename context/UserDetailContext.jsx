"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConvex } from "convex/react";

export const UserDetailContext = createContext();

export function UserDetailProvider({ children }) {
  const [userDetail, setUserDetail] = useState(null);
  const router = useRouter();
  const convex = useConvex();

  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem("user");

      // Reset user state
      setUserDetail(null);

      // Optional: Clear any Convex auth state
      // await convex.auth.signOut();

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail, logout }}>
      {children}
    </UserDetailContext.Provider>
  );
}
