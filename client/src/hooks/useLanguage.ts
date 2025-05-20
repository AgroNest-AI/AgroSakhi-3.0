import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "@/context/UserContext";

export type Language = "en" | "hi" | "ta" | "te" | "kn" | "mr";

export interface LanguageOption {
  code: Language;
  name: string;
  localName: string;
}

// Language options
export const languageOptions: LanguageOption[] = [
  { code: "en", name: "English", localName: "English" },
  { code: "hi", name: "Hindi", localName: "हिंदी" },
  { code: "ta", name: "Tamil", localName: "தமிழ்" },
  { code: "te", name: "Telugu", localName: "తెలుగు" },
  { code: "kn", name: "Kannada", localName: "ಕನ್ನಡ" },
  { code: "mr", name: "Marathi", localName: "मराठी" },
];

export function useLanguage() {
  const { i18n } = useTranslation();
  const { user } = useUser();
  const [language, setLanguageState] = useState<Language>(
    (i18n.language as Language) || "en"
  );

  // Update language based on user preferences
  useEffect(() => {
    if (user?.preferredLanguage) {
      const userLang = user.preferredLanguage as Language;
      changeLanguage(userLang);
    }
  }, [user]);

  // Change language
  const changeLanguage = (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang).catch(console.error);
    
    // Save to localStorage for persistence
    localStorage.setItem("preferredLanguage", lang);
    
    // In a real app, we would also update user preferences on the server
    // updateUserPreferences({ preferredLanguage: lang });
  };

  // Handle HTML document language
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return {
    language,
    changeLanguage,
    languages: languageOptions,
    isRTL: ["ar", "he", "fa", "ur"].includes(language),
  };
}
