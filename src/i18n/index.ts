import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ptCommon from "./locales/pt/common.json";
import ptPublic from "./locales/pt/public.json";
import ptTourist from "./locales/pt/tourist.json";
import ptHost from "./locales/pt/host.json";
import ptAdmin from "./locales/pt/admin.json";

import enCommon from "./locales/en/common.json";
import enPublic from "./locales/en/public.json";
import enTourist from "./locales/en/tourist.json";
import enHost from "./locales/en/host.json";
import enAdmin from "./locales/en/admin.json";

import esCommon from "./locales/es/common.json";
import esPublic from "./locales/es/public.json";
import esTourist from "./locales/es/tourist.json";
import esHost from "./locales/es/host.json";
import esAdmin from "./locales/es/admin.json";

export const LANGUAGES = [
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { common: ptCommon, public: ptPublic, tourist: ptTourist, host: ptHost, admin: ptAdmin },
      en: { common: enCommon, public: enPublic, tourist: enTourist, host: enHost, admin: enAdmin },
      es: { common: esCommon, public: esPublic, tourist: esTourist, host: esHost, admin: esAdmin },
    },
    fallbackLng: "pt",
    supportedLngs: ["pt", "en", "es"],
    defaultNS: "common",
    ns: ["common", "public", "tourist", "host", "admin"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "bpr-lang",
      caches: ["localStorage"],
    },
  });

export default i18n;
