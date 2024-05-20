import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export function useApp() {
  const app = useContext(AppContext);
  if (!app) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return app;
}