import { useState, useCallback, useEffect } from "react";

// Web Speech API types
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onerror: (event: any) => void;
  onend: () => void;
  onresult: (event: any) => void;
  onspeechend: () => void;
}

// Set up Speech Recognition with appropriate fallbacks
const SpeechRecognitionAPI = window.SpeechRecognition || 
                            (window as any).webkitSpeechRecognition;

// Hook for speech recognition
export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (SpeechRecognitionAPI) {
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "en-US"; // Default language
      
      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    } else {
      console.error("Speech recognition not supported in this browser");
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: !!SpeechRecognitionAPI
  };
}

// Hook for speech synthesis
export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthesis = window.speechSynthesis;

  const speak = useCallback((text: string, lang = "en") => {
    if (synthesis) {
      // Cancel any ongoing speech
      synthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "en" ? "en-US" : 
                       lang === "hi" ? "hi-IN" : 
                       "en-US";
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthesis.speak(utterance);
    } else {
      console.error("Speech synthesis not supported in this browser");
    }
  }, [synthesis]);

  const cancel = useCallback(() => {
    if (synthesis) {
      synthesis.cancel();
      setIsSpeaking(false);
    }
  }, [synthesis]);

  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (synthesis) {
        synthesis.cancel();
      }
    };
  }, [synthesis]);

  return {
    speak,
    cancel,
    isSpeaking,
    isSupported: !!synthesis
  };
}
