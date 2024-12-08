"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import CustomAlert from "@/components/CustomAlert";

interface AlertContextType {
  showAlert: (params: {
    message: string;
    subMessage?: string;
    type: "add" | "remove";
  }) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    subMessage?: string;
    type: "add" | "remove";
  } | null>(null);

  const showAlert = ({
    message,
    subMessage,
    type,
  }: {
    message: string;
    subMessage?: string;
    type: "add" | "remove";
  }) => {
    setAlert({ show: true, message, subMessage, type });
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AnimatePresence mode="wait">
        {alert?.show && (
          <CustomAlert
            message={alert.message}
            subMessage={alert.subMessage}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
