"use client";

import React, { use } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MessagesContext } from "@/context/MessagesContext";
import { useState, useContext } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "@/components/customs/AppSideBar";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export function ThemeProvider(props) {
  const [messages, setMessages] = useState();
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
          console.log(result);
        }
      }
    }
  };
  return (
    <div>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_KEY}>
        <PayPalScriptProvider options={{ clientId: "test" }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <NextThemesProvider
              {...rest}
              disableTransitionOnChange={false}
              storageKey="lucidai-theme"
            >
              <SidebarProvider>
                <AppSideBar />
                {children}
              </SidebarProvider>
            </NextThemesProvider>
          </MessagesContext.Provider>
        </PayPalScriptProvider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default ThemeProvider;
