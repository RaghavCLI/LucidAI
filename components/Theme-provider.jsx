"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MessagesContext } from "@/context/MessagesContext";
import { useState, useContext } from "react";

export function ThemeProvider(props) {
  const [messages, setMessages] = useState([]);
  const { children, ...rest } = props;
  return (
    <MessagesContext.Provider value={{ messages, setMessages }}>
      <NextThemesProvider
        {...rest}
        disableTransitionOnChange={false}
        storageKey="lucidai-theme"
      >
        {children}
      </NextThemesProvider>
    </MessagesContext.Provider>
  );
}

export default ThemeProvider;
