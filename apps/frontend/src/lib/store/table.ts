import {
	TableFactory,
	type ICreateTableSchemaInput,
	type IFilters,
	type IQueryFieldSchema,
	type IQueryTable,
	type IReferenceFieldQuerySchema,
	type IUpdateTableSchemaSchema,
	type Option,
	type Record,
	type Records,
	type Table,
	type ViewVO,
} from '@undb/core'
import { uniqBy } from 'lodash-es'
import { derived, writable, type Readable } from 'svelte/store'

export const allTables = writable<IQueryTable[]>()

export const currentTable = writable<Table>()
export const getTable = () => currentTable

export const currentView = writable<ViewVO>()
export const getView = () => currentView

export const currentRecords = writable<Records>([])
export const getRecords = () => currentRecords

export const createTableQ = () => {
	const { subscribe, update, set } = writable<globalThis.Record<string, string | undefined>>({})

	const setTableQ = (tableId: string, q: string | undefined) => update((value) => ({ ...value, [tableId]: q }))
	const resetTableQ = (tableId: string) => update((value) => ({ ...value, [tableId]: undefined }))

	return {
		subscribe,
		update,
		set,

		setTableQ,
		resetTableQ,
	}
}

export const tableQ = createTableQ()
export const q = derived([currentTable, tableQ], ([$table, $tableQ]) => $tableQ[$table.id.value])

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

export const dashboardWidges = derived(currentView, ($view) => $view.dashboard.into()?.widges ?? [])

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
	[currentTable, currentView, q],
	([$table, $view, $q]) => `records:${$table.id.value}:${$view.id.value}:${$view.displayType}:${$q}`,
)

export const getGroupRecordsHash = (id: string) => derived(recordHash, ($recordHash) => $recordHash + id)

export const currentOption = writable<Option | null>()
export const getOption = () => currentOption

export const currentVirsualizationId = writable<string | undefined>()
export const currentVirsualization = derived(
	[currentView, currentVirsualizationId],
	([$view, $currentVirsualizationId]) =>
		$currentVirsualizationId ? $view.getVirsualization($currentVirsualizationId) : undefined,
)

type INewTableScheam = {
	tableId?: string
	tableName?: string
	schema?: ICreateTableSchemaInput | IUpdateTableSchemaSchema
}

const createNewTableSchema = () => {
	const { update, set, subscribe } = writable<INewTableScheam>({})

	const reset = () => set({})

	return {
		update,
		set,
		subscribe,

		reset,
	}
}

export const newTableSchema = createNewTableSchema()

const getTableFields = ($table: Table | null, $newTableSchema: INewTableScheam) => {
	const newTableFields = ($newTableSchema.schema ?? []) as IQueryFieldSchema[]
	if (!$table) {
		return newTableFields
	}

	const tableFields = $table.schema.fields.map((f) => f.json) as IQueryFieldSchema[]
	if ($newTableSchema.tableId !== undefined && $table.id.value !== $newTableSchema.tableId) {
		return newTableFields
	}

	return uniqBy([...tableFields, ...newTableFields], 'id')
}

const _getForeignTableFields = ($table: Table | null, $newTableSchema: INewTableScheam) => {
	const newTableFields = ($newTableSchema.schema ?? []) as IQueryFieldSchema[]
	if (!$table) {
		return newTableFields
	}

	const tableFields = $table.schema.fields.map((f) => f.json) as IQueryFieldSchema[]
	if ($newTableSchema.tableId !== undefined && $table.id.value !== $newTableSchema.tableId) {
		return tableFields
	}

	return uniqBy([...tableFields, ...newTableFields], 'id')
}

export const allTableFields: Readable<IQueryFieldSchema[]> = derived(
	[currentTable, newTableSchema],
	([$currentTable, $newTableSchema]) => getTableFields($currentTable, $newTableSchema),
)

export const getForeignTable: Readable<(foreignTableId?: string) => Table | null> = derived(
	[allTables, currentTable],
	([$allTables, $currentTable]) => {
		return (foreignTableId?: string) => {
			if (!foreignTableId) return null
			if (foreignTableId === $currentTable.id.value) return $currentTable
			const found = $allTables.find((t) => t.id === foreignTableId)
			if (found) return TableFactory.fromQuery(found)

			return null
		}
	},
)

export const getForeignTableFields: Readable<(foreignTableId?: string) => IQueryFieldSchema[]> = derived(
	[getForeignTable, newTableSchema],
	([$getForeignTable, $newTableSchema]) => {
		return (foreignTableId?: string) => {
			const table = $getForeignTable(foreignTableId)
			return _getForeignTableFields(table, $newTableSchema)
		}
	},
)

export const getForeignTableIdByReferenceId: Readable<(referenceId?: string) => string | undefined> = derived(
	[allTableFields, newTableSchema],
	([$allTableFields, $newTableSchema]) => {
		return (referenceId?: string) => {
			if (!referenceId) return undefined

			const fields = [...$allTableFields, ...($newTableSchema.schema ?? [])]
			return (
				(fields.find((f) => f.id === referenceId) as IReferenceFieldQuerySchema | undefined)?.foreignTableId ??
				undefined
			)
		}
	},
)

export const getForeignTableFieldsByReferenceId: Readable<(referenceId?: string) => IQueryFieldSchema[]> = derived(
	[getForeignTableIdByReferenceId, getForeignTableFields],
	([$getForeignTableIdByReferenceId, $getForeignTableFields]) => {
		return (referenceId?: string) => {
			const foreignTableId = $getForeignTableIdByReferenceId(referenceId)
			return $getForeignTableFields(foreignTableId)
		}
	},
)
