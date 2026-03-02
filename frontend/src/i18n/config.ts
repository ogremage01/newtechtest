import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import koCommon from "@/locales/ko/common.json";
import enCommon from "@/locales/en/common.json";

const resources = {
  ko: { common: koCommon },
  en: { common: enCommon },
};

if (!i18n.isInitialized) {
  if (typeof window !== "undefined") {
    i18n.use(LanguageDetector);
  }

  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: "ko",
    supportedLngs: ["ko", "en"],
    ns: ["common"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });
}

export default i18n;
