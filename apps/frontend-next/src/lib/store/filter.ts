import type { IFilter } from '@undb/core'
import { writable } from 'svelte/store'

function createFiltersStore() {
	const { subscribe, update, set } = writable<Partial<IFilter>[]>([])
	return {
		subscribe,
		update,
		set,
		add: () => update((filters) => [...filters, {}]),
		reset: (index: number) =>
			update((filters) => filters.map((f, i) => (i === index ? { path: f.path, type: f.type } : f))),
		remove: (index: number) => update((filters) => filters.filter((_, i) => i !== index)),
	}
}

export const filters = createFiltersStore()
