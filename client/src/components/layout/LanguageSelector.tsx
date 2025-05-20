import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function LanguageSelector() {
  const { t } = useTranslation();
  const { language, setLanguage, languages } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as any);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="material-icons text-neutral-600">translate</span>
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[180px] h-8 border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500">
          <SelectValue placeholder="Select Language" />
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
