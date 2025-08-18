"use client";

import React, { use } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MessagesContext } from "@/context/MessagesContext";
import { useState, useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

export function ThemeProvider(props) {
  const [messages, setMessages] = useState([]);
  const [userDetail, setUserDetail] = useState(null);
  const convex = useConvex();
  const { children, ...rest } = props;

  useEffect(() => {
    isAuthenticated();
  }, []);

  const isAuthenticated = async () => {
    if (typeof window !== "undefined") {
      const userString = localStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        if (user?.email) {
          // fetch from db
          const result = await convex.query(api.users.getUser, {
            email: user.email,
          });
          setUserDetail(result);
          console.log(result);
        }
      }
    }
  };
  return (
    <div>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_KEY}>
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <NextThemesProvider
              {...rest}
              disableTransitionOnChange={false}
              storageKey="lucidai-theme"
            >
              {children}
            </NextThemesProvider>
          </MessagesContext.Provider>
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default ThemeProvider;
