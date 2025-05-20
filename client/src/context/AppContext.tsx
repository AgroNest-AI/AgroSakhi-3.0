import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "./UserContext";
import { useLanguage } from "../hooks/useLanguage";
import { useVoice } from "./VoiceContext";

interface AppContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  isOnline: boolean;
  isAppLoading: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { language } = useLanguage();
  const { speak } = useVoice();
  
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Initialize app state
  useEffect(() => {
    // Check for user preferred theme
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme("dark");
    }
    
    // Apply theme
    document.documentElement.classList.toggle("dark", theme === "dark");
    
    // Check for online status
    setIsOnline(navigator.onLine);
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));
    
    // Finish loading
    setIsAppLoading(false);
    
    return () => {
      window.removeEventListener("online", () => setIsOnline(true));
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  // Update document class when theme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Welcome message when user loads app
  useEffect(() => {
    if (user && !isAppLoading) {
      // Get time of day for greeting
      const hour = new Date().getHours();
      let greeting = "";
      
      if (hour < 12) {
        greeting = language === "hi" ? "सुप्रभात" : "Good morning";
      } else if (hour < 18) {
        greeting = language === "hi" ? "नमस्कार" : "Good afternoon";
      } else {
        greeting = language === "hi" ? "शुभ संध्या" : "Good evening";
      }
      
      const welcomeMessage = language === "hi" 
        ? `${greeting}, ${user.displayName}. अग्रोसखी में आपका स्वागत है।`
        : `${greeting}, ${user.displayName}. Welcome to AgroSakhi.`;
      
      speak(welcomeMessage);
    }
  }, [user, language, isAppLoading, speak]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        isOnline,
        isAppLoading,
        isMenuOpen,
        toggleMenu,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
