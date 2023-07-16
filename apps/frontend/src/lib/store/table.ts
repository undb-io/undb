import { page } from '$app/stores'
import { trpc } from '$lib/trpc/client'
import type { CreateQueryResult } from '@tanstack/svelte-query'
import {
	ChartVisualization,
	NumberVisualization,
	TableFactory,
	TreeField,
	type IChartData,
	type ICreateTableSchemaInput,
	type IFilters,
	type IQueryFieldSchema,
	type IQueryRecordSchema,
	type IQueryTable,
	type IQueryTreeRecords,
	type IReferenceFieldQuerySchema,
	type IRootFilter,
	type IUpdateTableSchemaSchema,
	type Option,
	type Record,
	type Records,
	type Table,
	type ViewVO,
} from '@undb/core'
import type { IShareTarget } from '@undb/integrations/dist'
import { uniqBy } from 'lodash-es'
import { derived, writable, type Readable } from 'svelte/store'
import { match } from 'ts-pattern'

export const allTables = writable<IQueryTable[] | undefined>()

export const currentTable = writable<Table>()
export const getTable = () => currentTable

export const currentView = writable<ViewVO>()
export const getView = () => currentView

export const currentRecords = writable<Records>([])
export const getRecords = () => currentRecords

export const allTablesExcludeCurren = derived([allTables, currentTable], ([$allTables, $table]) =>
	($allTables ?? []).filter((t) => t.id !== $table.id.value).map((t) => TableFactory.fromQuery(t)),
)

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

export const dashboardWidgets = derived(currentView, ($view) => $view.dashboard.into()?.widgets ?? [])

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

export const currentVisualizationId = writable<string | undefined>()
export const currentVisualization = derived([currentView, currentVisualizationId], ([$view, $currentVisualizationId]) =>
	$currentVisualizationId ? $view.getVisualization($currentVisualizationId) : undefined,
)

type INewTableSchema = {
	tableId?: string
	tableName?: string
	schema?: ICreateTableSchemaInput | IUpdateTableSchemaSchema
}

const createNewTableSchema = () => {
	const { update, set, subscribe } = writable<INewTableSchema>({})

	const reset = () => set({})

	return {
		update,
		set,
		subscribe,

		reset,
	}
}

export const newTableSchema = createNewTableSchema()

const getTableFields = ($table: Table | null, $newTableSchema: INewTableSchema) => {
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

const _getForeignTableFields = ($table: Table | null, $newTableSchema: INewTableSchema) => {
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
			const found = $allTables?.find((t) => t.id === foreignTableId)
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

export const isShare = derived(page, ($page) => $page.route.id?.startsWith('/(share)'))
export const isShareView = derived(page, ($page) => $page.route.id === '/(share)/s/v/[viewId]')
export const isShareForm = derived(page, ($page) => $page.route.id === '/(share)/s/f/[formId]')

export const shareTarget = derived([isShareView, isShareForm, page], ([$isShareView, $isShareForm, $page]) => {
	let target: IShareTarget | undefined

	if ($isShareView) {
		target = { id: $page.params.viewId, type: 'view' }
	} else if ($isShareForm) {
		target = { id: $page.params.formId, type: 'form' }
	}

	return target
})

export const readonly = derived(isShare, ($isShare) => $isShare)

export const listRecordsType = derived(isShareView, ($isShareView) => {
	if ($isShareView) return 'share.view' as const
	return 'internal' as const
})

type ListRecordQueryOptions = {
	queryHash?: string
	enabled?: boolean
}

export const listRecordFn: Readable<
	(filter?: IRootFilter, options?: ListRecordQueryOptions) => CreateQueryResult<{ records: IQueryRecordSchema[] }>
> = derived([listRecordsType, currentTable, currentView, q, recordHash], ([$type, $table, $view, $q, $recordHash]) => {
	return match($type)
		.with(
			'internal',
			() => (filter?: IRootFilter, options?: ListRecordQueryOptions) =>
				trpc().record.list.query(
					{ tableId: $table.id.value, viewId: $view.id.value, q: $q, filter },
					{ refetchOnMount: false, refetchOnWindowFocus: true, queryHash: $recordHash, ...options },
				),
		)
		.with(
			'share.view',
			() => (filter?: IRootFilter, options?: ListRecordQueryOptions) =>
				trpc().share.viewRecords.query(
					{ viewId: $view.id.value, q: $q, filter },
					{ refetchOnMount: false, refetchOnWindowFocus: true, queryHash: $recordHash, ...options },
				),
		)
		.exhaustive()
})

export const listTreeRecordsFn: Readable<
	(field: TreeField, options?: ListRecordQueryOptions) => CreateQueryResult<{ records: IQueryTreeRecords }>
> = derived([listRecordsType, currentTable, currentView, recordHash], ([$type, $table, $view, $recordHash]) => {
	return match($type)
		.with(
			'internal',
			() => (field: TreeField, options?: ListRecordQueryOptions) =>
				trpc().record.tree.list.query(
					{
						tableId: $table.id.value,
						fieldId: field.id.value,
					},
					{
						queryHash: $recordHash + 'tree',
						...options,
					},
				),
		)
		.with(
			'share.view',
			() => (field: TreeField, options?: ListRecordQueryOptions) =>
				trpc().share.viewTreeRecords.query(
					{ viewId: $view.id.value, fieldId: field.id.value },
					{ refetchOnMount: false, refetchOnWindowFocus: true, queryHash: $recordHash + 'tree', ...options },
				),
		)
		.exhaustive()
})

export const aggregateNumberFn: Readable<
	(visualization: NumberVisualization, options?: ListRecordQueryOptions) => CreateQueryResult<{ number: number }>
> = derived([listRecordsType, currentTable, currentView], ([$type, $table, $view]) => {
	return match($type)
		.with(
			'internal',
			() => (visualization: NumberVisualization, options?: ListRecordQueryOptions) =>
				trpc().table.aggregate.aggregateNumber.query(
					{
						tableId: $table.id.value,
						viewId: $view.id.value,
						visualizationId: visualization.id.value,
					},
					options,
				),
		)
		.with(
			'share.view',
			() => (visualization: NumberVisualization, options?: ListRecordQueryOptions) =>
				trpc().share.viewAggregateNumber.query(
					{ viewId: $view.id.value, visualizationId: visualization.id.value },
					{ refetchOnMount: false, refetchOnWindowFocus: true, ...options },
				),
		)
		.exhaustive()
})

export const aggregateChartFn: Readable<
	(visualization: ChartVisualization, options?: ListRecordQueryOptions) => CreateQueryResult<{ data: IChartData }>
> = derived([listRecordsType, currentTable, currentView], ([$type, $table, $view]) => {
	return match($type)
		.with(
			'internal',
			() => (visualization: ChartVisualization, options?: ListRecordQueryOptions) =>
				trpc().table.aggregate.chart.query(
					{
						tableId: $table.id.value,
						viewId: $view.id.value,
						visualizationId: visualization.id.value,
					},
					{ queryHash: visualization.id.value, ...options },
				),
		)
		.with(
			'share.view',
			() => (visualization: ChartVisualization, options?: ListRecordQueryOptions) =>
				trpc().share.viewAggregateChart.query(
					{ viewId: $view.id.value, visualizationId: visualization.id.value },
					{ refetchOnMount: false, refetchOnWindowFocus: true, queryHash: visualization.id.value, ...options },
				),
		)
		.exhaustive()
})

export const tableById = derived(
	[currentTable, allTables, shareTarget],
	([$table, $tables, $shareTarget]) =>
		(tableId: string) => {
			let t: Table | undefined

			if (tableId === $table.id.value) t = $table
			else if ($tables) {
				const found = $tables.find((t) => t.id === tableId)
				if (found) t = TableFactory.fromQuery(found)
			} else if ($shareTarget) {
				trpc()
					.share.table.utils.fetch({ id: tableId, target: $shareTarget })
					.then(({ table }) => {
						t = TableFactory.fromQuery(table)
					})
			}

			return t
		},
)
