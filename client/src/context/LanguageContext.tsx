import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "./UserContext";

type Language = "en" | "hi" | "ta" | "te" | "kn" | "ml" | "mr" | "gu" | "pa" | "or" | "bn" | "as" | "sa";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  languages: { code: Language; name: string }[];
}

const languageOptions = [
  { code: "en" as Language, name: "English" },
  { code: "hi" as Language, name: "हिन्दी (Hindi)" },
  { code: "ta" as Language, name: "தமிழ் (Tamil)" },
  { code: "te" as Language, name: "తెలుగు (Telugu)" },
  { code: "kn" as Language, name: "ಕನ್ನಡ (Kannada)" },
  { code: "ml" as Language, name: "മലയാളം (Malayalam)" },
  { code: "mr" as Language, name: "मराठी (Marathi)" },
  { code: "gu" as Language, name: "ગુજરાતી (Gujarati)" },
  { code: "pa" as Language, name: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "or" as Language, name: "ଓଡ଼ିଆ (Odia)" },
  { code: "bn" as Language, name: "বাংলা (Bengali)" },
  { code: "as" as Language, name: "অসমীয়া (Assamese)" },
  { code: "sa" as Language, name: "संस्कृतम् (Sanskrit)" },
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Set language based on user preference if available
    if (user?.preferredLanguage) {
      const userLang = user.preferredLanguage as Language;
      setLanguageState(userLang);
      i18n.changeLanguage(userLang);
    }
  }, [user, i18n]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    
    // TODO: If we had a real API, we would update user preference here
    // updateUserPreference(user?.id, { preferredLanguage: lang });
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        languages: languageOptions,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
