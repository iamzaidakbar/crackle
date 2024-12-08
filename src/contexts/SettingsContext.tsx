"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Settings {
  showAlerts: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    showAlerts: true,
  });

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    localStorage.setItem(
      "settings",
      JSON.stringify({ ...settings, ...newSettings })
    );
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
