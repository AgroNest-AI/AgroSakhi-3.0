// Web Speech API types
export interface SpeechRecognition extends EventTarget {
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

export interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

export interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Get Speech Recognition API with fallback
export const SpeechRecognitionAPI: new () => SpeechRecognition =
  window.SpeechRecognition || 
  (window as any).webkitSpeechRecognition || 
  (window as any).mozSpeechRecognition || 
  (window as any).msSpeechRecognition;

// Check if speech recognition is supported
export const isSpeechRecognitionSupported = !!SpeechRecognitionAPI;

// Get Speech Synthesis API
export const speechSynthesis = window.speechSynthesis;

// Check if speech synthesis is supported
export const isSpeechSynthesisSupported = !!speechSynthesis;

// Language mapping for speech recognition (BCP 47 language tags)
export const speechRecognitionLanguages: Record<string, string> = {
  en: "en-US",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  mr: "mr-IN",
};

// Language mapping for speech synthesis (BCP 47 language tags)
export const speechSynthesisLanguages: Record<string, string> = {
  en: "en-US",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  mr: "mr-IN",
};

// Create a new speech recognition instance
export function createSpeechRecognition(language: string = "en"): SpeechRecognition | null {
  if (!isSpeechRecognitionSupported) {
    console.error("Speech recognition is not supported in this browser");
    return null;
  }

  const recognition = new SpeechRecognitionAPI();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = speechRecognitionLanguages[language] || "en-US";

  return recognition;
}

// Speak text using speech synthesis
export function speakText(text: string, language: string = "en"): void {
  if (!isSpeechSynthesisSupported) {
    console.error("Speech synthesis is not supported in this browser");
    return;
  }

  // Cancel any ongoing speech
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = speechSynthesisLanguages[language] || "en-US";

  speechSynthesis.speak(utterance);
}

// Cancel any ongoing speech
export function cancelSpeech(): void {
  if (isSpeechSynthesisSupported) {
    speechSynthesis.cancel();
  }
}

// Process voice commands to determine intent and parameters
export function processVoiceCommand(command: string): {
  intent: string;
  params: Record<string, string>;
} {
  const lowerCommand = command.toLowerCase();
  
  // Simple intent matching
  if (lowerCommand.includes("weather") || lowerCommand.includes("मौसम")) {
    return { intent: "get_weather", params: {} };
  } 
  else if (lowerCommand.includes("soil moisture") || lowerCommand.includes("मिट्टी")) {
    return { intent: "check_soil_moisture", params: {} };
  }
  else if (lowerCommand.includes("task") || lowerCommand.includes("काम")) {
    if (lowerCommand.includes("add") || lowerCommand.includes("create") || lowerCommand.includes("जोड़")) {
      // Extract task details
      return { 
        intent: "add_task", 
        params: { taskName: command } 
      };
    } else {
      return { intent: "view_tasks", params: {} };
    }
  }
  else if (lowerCommand.includes("market") || lowerCommand.includes("बाजार")) {
    return { intent: "open_marketplace", params: {} };
  }
  else if (lowerCommand.includes("crop") || lowerCommand.includes("फसल")) {
    return { intent: "view_crops", params: {} };
  }
  
  // Default intent
  return { intent: "unknown", params: {} };
}
