import type { Records } from '@undb/core'
import { derived, writable } from 'svelte/store'

const createRecordsSelection = () => {
	const { update, set, subscribe } = writable<Record<string, boolean>>({})

	const reset = () => {
		set({})
	}

	const updateSelect = (recordId: string, selected: boolean) =>
		update(($selection) => {
			$selection[recordId] = selected
			return $selection
		})

	const updateAll = (records: Records, s: boolean) => {
		const selected: Record<string, boolean> = {}
		for (const record of records) {
			selected[record.id.value] = s
		}

		set(selected)
	}

	return {
		update,
		set,
		subscribe,

		reset,
		updateSelect,
		updateAll,
	}
}

export const recordSelection = createRecordsSelection()

export const selectedRecords = derived(recordSelection, ($selection) =>
	Object.entries($selection)
		.filter(([, value]) => value)
		.map(([key]) => key),
)
export const selectedCount = derived(recordSelection, ($selection) => Object.values($selection).filter(Boolean).length)
