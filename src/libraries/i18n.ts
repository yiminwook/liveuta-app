import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEn from "@/messages/en.json";
import translationKo from "@/messages/ko.json";
import translationJa from "@/messages/ja.json";
import { getLocales } from "expo-localization";

const resources = {
  en: { translation: translationEn },
  ko: { translation: translationKo },
  ja: { translation: translationJa },
};

const initI18n = () => {
  i18n.use(initReactI18next).init({
    resources,
    lng: getLocales()[0].languageCode || "ko",
    fallbackLng: "ko",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
};

initI18n();

export default i18n;
