import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const languages = [
  { code: "pt", name: "Português" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "en", name: "English" }
];

export function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={i18n.language === lang.code ? "default" : "outline"}
          size="sm"
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`language-selector ${
            i18n.language === lang.code ? "bg-primary text-primary-foreground" : ""
          }`}
        >
          <Globe className="h-4 w-4 mr-1" />
          {lang.code.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}