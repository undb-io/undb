import type { IFilters, Record, Records, Table, View } from '@undb/core'
import { derived, writable } from 'svelte/store'

export const currentTable = writable<Table>()
export const getTable = () => currentTable

export const currentView = writable<View>()
export const getView = () => currentView

export const records = writable<Records>()
export const getRecords = () => records

export const currentRecordId = writable<string | undefined>()
export const currentRecord = writable<Record | undefined>()
export const getRecord = () => currentRecord

export const currentFieldId = writable<string | undefined>()
export const currentField = derived([currentTable, currentFieldId], ([table, fieldId]) =>
	fieldId ? table.schema.getFieldById(fieldId).into(null) : null,
)
export const getField = () => currentField

export const sorts = derived(currentView, (view) => view.sorts?.sorts ?? [])
// TODO: nested should be IFilters
export const filters = derived(currentView, (view) => (view.filter?.group.children ?? []) as IFilters)

export const currentRecordIndex = derived([currentRecordId, records], ([$id, $records]) =>
	$id ? $records.findIndex((r) => r.id.value === $id) : undefined,
)

export const nextRecord = derived([currentRecordIndex, records], ([$index, $records]) => {
	if (typeof $index === 'undefined') return undefined
	if ($index === $records.length - 1) return undefined
	return $records[$index + 1]
})

export const previousRecord = derived([currentRecordIndex, records], ([$index, $records]) => {
	if (typeof $index === 'undefined') return undefined
	if ($index === 0) return undefined
	return $records[$index - 1]
})
