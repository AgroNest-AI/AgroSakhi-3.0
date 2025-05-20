import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { useSpeechRecognition, useSpeechSynthesis } from "../hooks/useVoiceRecognition";
import { useLanguage } from "./LanguageContext";

interface VoiceContextType {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  isSpeaking: boolean;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isVoiceAssistantOpen: boolean;
  toggleVoiceAssistant: () => void;
  processVoiceCommand: (command: string) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  
  const {
    isListening,
    startListening: startSpeechRecognition,
    stopListening: stopSpeechRecognition,
    transcript,
    resetTranscript,
  } = useSpeechRecognition();

  const {
    speak: speakText,
    cancel: cancelSpeech,
    isSpeaking,
  } = useSpeechSynthesis();

  // Update speech recognition language when user language changes
  useEffect(() => {
    // Map our language codes to BCP 47 language tags
    const langMap: Record<string, string> = {
      en: "en-US",
      hi: "hi-IN",
      ta: "ta-IN",
      te: "te-IN",
      kn: "kn-IN",
      mr: "mr-IN",
    };
    
    stopSpeechRecognition();
    resetTranscript();
    // If we need to change recognition language, we'd do it here
  }, [language, resetTranscript, stopSpeechRecognition]);

  const startListening = useCallback(() => {
    resetTranscript();
    startSpeechRecognition();
  }, [resetTranscript, startSpeechRecognition]);

  const stopListening = useCallback(() => {
    stopSpeechRecognition();
    if (transcript) {
      setLastCommand(transcript);
    }
  }, [stopSpeechRecognition, transcript]);

  const speak = useCallback(
    (text: string) => {
      speakText(text, language);
    },
    [speakText, language]
  );

  const stopSpeaking = useCallback(() => {
    cancelSpeech();
  }, [cancelSpeech]);

  const toggleVoiceAssistant = useCallback(() => {
    setIsVoiceAssistantOpen(prev => {
      if (!prev) {
        // If opening the voice assistant, start listening
        startListening();
      } else {
        // If closing, stop listening
        stopListening();
      }
      return !prev;
    });
  }, [startListening, stopListening]);

  // Basic command processing function
  const processVoiceCommand = useCallback(
    (command: string) => {
      const lowerCommand = command.toLowerCase();
      
      // Simple command processing examples
      if (lowerCommand.includes("weather") || lowerCommand.includes("मौसम")) {
        speak("Here is the current weather information.");
      } else if (lowerCommand.includes("soil moisture") || lowerCommand.includes("मिट्टी")) {
        speak("Checking soil moisture levels in your fields.");
      } else if (lowerCommand.includes("task") || lowerCommand.includes("काम")) {
        speak("Let me help you manage your tasks.");
      } else if (lowerCommand.includes("market") || lowerCommand.includes("बाजार")) {
        speak("Opening the marketplace for you.");
      } else {
        speak("I'm sorry, I didn't understand that command. Please try again.");
      }
      
      // Close the voice assistant after processing
      setTimeout(() => {
        setIsVoiceAssistantOpen(false);
      }, 3000);
    },
    [speak]
  );

  // Process the last command when it changes
  useEffect(() => {
    if (lastCommand && !isListening) {
      processVoiceCommand(lastCommand);
      setLastCommand("");
    }
  }, [lastCommand, isListening, processVoiceCommand]);

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        startListening,
        stopListening,
        transcript,
        isSpeaking,
        speak,
        stopSpeaking,
        isVoiceAssistantOpen,
        toggleVoiceAssistant,
        processVoiceCommand,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error("useVoice must be used within a VoiceProvider");
  }
  return context;
}
