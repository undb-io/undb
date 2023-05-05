import type { IFilters, Option, Record, Records, Table, View } from '@undb/core'
import { derived, writable } from 'svelte/store'

export const currentTable = writable<Table>()
export const getTable = () => currentTable

export const currentView = writable<View>()
export const getView = () => currentView

export const currentRecords = writable<Records>([])
export const getRecords = () => currentRecords

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

export const currentRecordIndex = derived([currentRecordId, currentRecords], ([$id, $records]) =>
	$id ? $records.findIndex((r) => r.id.value === $id) : undefined,
)

export const nextRecord = derived([currentRecordIndex, currentRecords], ([$index, $records]) => {
	if (typeof $index === 'undefined') return undefined
	if ($index === $records.length - 1) return undefined
	return $records[$index + 1]
})

export const previousRecord = derived([currentRecordIndex, currentRecords], ([$index, $records]) => {
	if (typeof $index === 'undefined') return undefined
	if ($index === 0) return undefined
	return $records[$index - 1]
})

export const recordHash = derived(
	[currentTable, currentView],
	([$table, $view]) => `records:${$table.id.value}:${$view.id.value}:${$view.displayType}`,
)

export const getGroupRecordsHash = (id: string) => derived(recordHash, ($recordHash) => $recordHash + id)

export const currentOption = writable<Option | null>()
export const getOption = () => currentOption
