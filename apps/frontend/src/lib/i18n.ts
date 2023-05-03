import { config } from '@undb/i18n'
import i18next from 'i18next'
import { createI18nStore } from 'svelte-i18next'
import { derived } from 'svelte/store'

export const tt = await i18next.init(config)

export const i18n = createI18nStore(i18next)

export const t = derived(i18n, ($i18n) => $i18n.t)
