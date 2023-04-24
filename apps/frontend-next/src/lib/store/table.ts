import type { Records, Table, View } from '@undb/core'
import { derived, writable } from 'svelte/store'

export const currentTable = writable<Table>()
export const getTable = () => currentTable

export const currentView = writable<View>()
export const getView = () => currentView

export const records = writable<Records>()
export const getRecords = () => records

export const currentFieldId = writable<string | undefined>()
export const currentField = derived([currentTable, currentFieldId], ([table, fieldId]) =>
	fieldId ? table.schema.getFieldById(fieldId).into(null) : null,
)
export const getField = () => currentField
