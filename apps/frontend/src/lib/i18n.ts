import { config } from '@undb/i18n'
import localEn from 'date-fns/locale/en-US'
import localZhCn from 'date-fns/locale/zh-CN'
import i18next, { type TFunction } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'
import { createI18nStore } from 'svelte-i18next'
import { derived, type Readable } from 'svelte/store'

export const tt = await i18next.use(HttpBackend).use(LanguageDetector).init(config)

export const i18n = createI18nStore(i18next)

export const t = derived(i18n, ($i18n) => $i18n.t) as Readable<TFunction>

export const language = derived(i18n, ($i18n) => $i18n.language)

export const dateFnLocal = derived(language, ($lng) => {
	if ($lng === 'zh-CN') return localZhCn
	return localEn
})
