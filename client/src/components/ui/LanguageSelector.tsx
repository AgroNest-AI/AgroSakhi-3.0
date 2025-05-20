import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LanguageSelector() {
  const { language, setLanguage, languages } = useLanguage();
  const { t } = useTranslation();

  return (
    <div className="relative min-w-[160px]">
      <Select
        value={language}
        onValueChange={(value) => {
          setLanguage(value);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("language_selector")} />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default LanguageSelector;