import translations from "./../../Translation.json";

export const getTranslation = (key, language) => {
  return translations[language]?.[key] || key;
};
