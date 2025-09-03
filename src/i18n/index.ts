import { createI18n } from 'vue-i18n'
import en from './locales/en'
import es from './locales/es'
import hr from './locales/hr'
import { storage } from '@/services/storageService'

// Get saved locale from localStorage or use browser's language
const savedLocale = storage.get('locale') || 
  (navigator.language.includes('hr') ? 'hr' : 
   navigator.language.includes('es') ? 'es' : 'en')

export default createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'hr',
  messages: {
    en,
    es,
    hr
  }
})