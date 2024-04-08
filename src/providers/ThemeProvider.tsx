import { createContext, useEffect, ReactNode } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeContext = createContext("light");

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);
  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
