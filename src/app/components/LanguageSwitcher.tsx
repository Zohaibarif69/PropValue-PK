import { Globe } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-0.5">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 rounded-md transition-all text-sm font-medium flex items-center gap-1.5 ${
          language === "en"
            ? "bg-white text-indigo-600 shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <Globe className="w-3.5 h-3.5" />
        English
      </button>
      <button
        onClick={() => setLanguage("ur")}
        className={`px-3 py-1.5 rounded-md transition-all text-sm font-medium ${
          language === "ur"
            ? "bg-white text-indigo-600 shadow-sm"
            : "text-slate-600 hover:text-slate-900"
        }`}
        style={{ fontFamily: language === "ur" ? "Arial Unicode MS, Arial, sans-serif" : undefined }}
      >
        اردو
      </button>
    </div>
  );
}
