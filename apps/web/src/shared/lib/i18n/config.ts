import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './locales/en'
import { ru } from './locales/ru'
import { fr } from './locales/fr'
import { de } from './locales/de'
import { es } from './locales/es'
import { zh } from './locales/zh'

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      fr: { translation: fr },
      de: { translation: de },
      es: { translation: es },
      zh: { translation: zh },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })
}

export default i18n
