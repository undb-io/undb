import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: {
          hello: 'hello',
        },
        table: {
          'Create New Record': 'Create New Record',
          Views: 'Views',
          Filter: 'Filter',
          Sort: 'Sort',
          'Config Fields': 'Fields',
        },
      },
      zh: {
        translation: {
          hello: '你好',
        },
        table: {
          'Create New Record': '创建新记录',
          Views: '视图',
          Filter: '筛选',
          Sort: '排序',
          'Config Fields': '配置列',
        },
      },
    },
    ns: ['translation', 'table'],
    defaultNS: 'table',
    lng: undefined, // if you're using a language detector, do not define the lng option
    fallbackLng: 'zh',

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  })

export default i18n
