import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        common: {
          Apply: 'Apply',
          Cancel: 'Cancel',
          Confirm: 'Confirm',
          Delete: 'Delete',
          Create: 'Create',
          Done: 'Done',
          Update: 'Update',
          Name: 'Name',
          Type: 'Type',
        },
        table: {
          'Create New Record': 'Create New Record',
          Views: 'Views',
          Filter: 'Filter',
          Sort: 'Sort',
          'Config Fields': 'Fields',
          'Select Display Type': 'Select Display Type',
          Grid: 'Grid',
          Kanban: 'Kanban',
          Calendar: 'Calendar',
          Tree: 'Tree',
          'Select View': 'Select View',
          'Update View Name': 'Update View Name',
          'Duplicate View': 'Duplicate View',
          'Delete View': 'Delete View',
          'Search Field': 'Search Field',
          'Create New Table': 'Create New Table',
          'Create New Field': 'Create New Field',
          'Create New Filter': 'Create New Filter',
          'Create New Sort': 'Create New Sort',
        },
      },
      zh: {
        common: {
          Apply: '应用',
          Cancel: '取消',
          Confirm: '确认',
          Delete: '删除',
          Create: '创建',
          Done: '完成',
          Update: '更新',
          Name: '名称',
          Type: '类型',
        },
        table: {
          'Create New Record': '创建新记录',
          Views: '视图',
          Filter: '筛选',
          Sort: '排序',
          'Config Fields': '配置列',
          'Select Display Type': '切换视图类型',
          Grid: '表格',
          Kanban: '看板',
          Calendar: '日历',
          Tree: '树形',
          'Select View': '选择视图',
          'Update View Name': '更新视图名称',
          'Duplicate View': '复制视图',
          'Delete View': '删除视图',
          'Search Field': '搜索列',
          'Create New Table': '创建表',
          'Create New Field': '创建列',
          'Create New Filter': '添加筛选',
          'Create New Sort': '添加排序',
        },
      },
    },
    ns: ['common', 'table'],
    defaultNS: 'table',
    lng: undefined, // if you're using a language detector, do not define the lng option
    fallbackLng: 'zh',

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  })

export default i18n
