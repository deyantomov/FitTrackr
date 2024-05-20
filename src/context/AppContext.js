import { createContext } from "react";

export const AppContext = createContext({
  app: null,
  logIn: () => Promise.resolve(null),
  logOut: () => Promise.resolve(null)
});
