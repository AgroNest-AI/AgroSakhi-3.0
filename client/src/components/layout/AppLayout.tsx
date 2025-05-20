import { ReactNode } from "react";
import { useLocation } from "wouter";
import NavigationBar from "./NavigationBar";
import LanguageSelector from "./LanguageSelector";
import VoiceAssistant from "../ui/VoiceAssistant";
import { useVoice } from "../../context/VoiceContext";
import { useUser } from "../../context/UserContext";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user } = useUser();
  const { isVoiceAssistantOpen, toggleVoiceAssistant } = useVoice();
  const [location] = useLocation();
  
  // Helper function to get page title from route
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Home";
      case "/iot":
        return "IoT Devices";
      case "/market":
        return "Marketplace";
      case "/learn":
        return "Learning";
      case "/dashboard":
        return "Dashboard";
      default:
        return "AgroSakhi";
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Language Selector */}
      <div className="bg-white border-b border-neutral-200 py-2 px-4 flex justify-end items-center">
        <LanguageSelector />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto pb-16">
        {children}
      </div>

      {/* Voice Assistant Button (fixed position) */}
      <button 
        className="fixed bottom-20 right-4 w-12 h-12 bg-accent-500 text-white rounded-full flex items-center justify-center shadow-lg pulse z-10"
        onClick={toggleVoiceAssistant}
        aria-label="Voice Assistant"
      >
        <span className="material-icons">mic</span>
      </button>

      {/* Voice Assistant Panel */}
      {isVoiceAssistantOpen && <VoiceAssistant />}

      {/* Navigation Bar (fixed at bottom) */}
      <NavigationBar />
    </div>
  );
}
