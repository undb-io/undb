import type { IFilter } from '@undb/core'
import { writable } from 'svelte/store'

function createFiltersStore() {
	const { subscribe, update, set } = writable<Partial<IFilter>[]>([{}])
	return {
		subscribe,
		update,
		set,
		add: () => update((filters) => [...filters, {}]),
		remove: (index: number) =>
			update((filters) => {
				if (filters.length <= 1) return [{}]
				return filters.filter((_, i) => i !== index)
			}),
	}
}

export const filters = createFiltersStore()
