"use client";
import { createContext, useContext, useState } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <UIContext.Provider value={{ loginOpen, setLoginOpen }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
