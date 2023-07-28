import { formatDistanceToNow } from 'date-fns'
import { derived } from 'svelte/store'
import { dateFnLocal } from './i18n'

export const formatDistance = derived(
	dateFnLocal,
	($locale) => (date: Date) => formatDistanceToNow(date, { includeSeconds: true, locale: $locale, addSuffix: true }),
)
