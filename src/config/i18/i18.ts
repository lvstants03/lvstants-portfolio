import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import viNav from "../../i18n/locales/vi/nav.json";
import viHome from "../../i18n/locales/vi/home.json";
import viAbout from "../../i18n/locales/vi/about.json";
import viSkills from "../../i18n/locales/vi/skills.json";
import viProjects from "../../i18n/locales/vi/projects.json";
import viCertificates from "../../i18n/locales/vi/certificates.json"; 
import viFooter from "../../i18n/locales/vi/footer.json";
import viExperencies from "../../i18n/locales/vi/experience.json";
import enNav from "../../i18n/locales/en/nav.json";
import enHome from "../../i18n/locales/en/home.json";
import enAbout from "../../i18n/locales/en/about.json";
import enSkills from "../../i18n/locales/en/skills.json";
import enProjects from "../../i18n/locales/en/projects.json";
import enCertificates from "../../i18n/locales/en/certificates.json"; 
import enFooter from "../../i18n/locales/en/footer.json";
import enExperencies from "../../i18n/locales/en/experience.json";
import viContact from "../../i18n/locales/vi/contact.json";
import viLegal from "../../i18n/locales/vi/legal.json";
import enContact from "../../i18n/locales/en/contact.json";
import enLegal from "../../i18n/locales/en/legal.json";


export const resources = {
vi: {
    translation: {
      nav: viNav,
      home: viHome,
      about: viAbout,
      skills: viSkills,
      projects: viProjects,
      certificates: viCertificates,
      experience: viExperencies,
      footer: viFooter,
      contact: viContact,
      legal: viLegal
    }
  },
  en: {
    translation: {
      nav: enNav,
      home: enHome,
      about: enAbout,
      skills: enSkills,
      projects: enProjects,
      certificates: enCertificates,
      experience: enExperencies,
      footer: enFooter,
      contact: enContact,
      legal: enLegal
    }
  }
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'], // Ưu tiên lưu trữ cục bộ trước, sau đó tới trình duyệt
      caches: ['localStorage'],
    }
  });

export default i18n;