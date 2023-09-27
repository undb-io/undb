import { page } from '$app/stores'
import { trpc } from '$lib/trpc/client'
import type { CreateQueryResult } from '@tanstack/svelte-query'
import { FLS, isFLSUserMatch, isUserMatch, type RLS } from '@undb/authz'
import {
	ChartVisualization,
	NumberVisualization,
	TableFactory,
	TreeField,
	type IChartData,
	type ICreateTableInput,
	type ICreateTableSchemaInput,
	type IFilters,
	type IQueryBase,
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
import { andOptions } from '@undb/domain'
import type { IShareTarget } from '@undb/integrations'
import { isUndefined, keyBy, uniqBy } from 'lodash-es'
import { derived, writable, type Readable } from 'svelte/store'
import { match } from 'ts-pattern'
import { hasPermission } from './authz'
import { me } from './me'

export const allBases = writable<IQueryBase[]>([])
export const allTables = writable<IQueryTable[] | undefined>()

export const currentTable = writable<Table>()
export const getTable = () => currentTable

export const currentView = writable<ViewVO>()
export const getView = () => currentView

export const currentRecords = writable<Records>([])

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
export const currentFieldMenuRect = writable<DOMRect | undefined>()
export const currentField = derived([currentTable, currentFieldId], ([table, fieldId]) =>
	fieldId ? table.schema.getFieldById(fieldId).into(null) : null,
)
export const getField = () => currentField

export const createRecordStore = (inputs: Records = []) => {
	const recordsOrder = inputs.map((r) => r.id.value)
	const recordsMap = keyBy(inputs, (record) => record.id.value)

	const store = writable({ order: recordsOrder, recordsMap: recordsMap })
	const { set, update, subscribe } = store

	const setRecord = (record: Record) => {
		return update(($store) => {
			$store.recordsMap[record.id.value] = record
			if (!$store.order.includes(record.id.value)) {
				$store.order = [...$store.order, record.id.value]
			}
			return $store
		})
	}

	const setRecords = (records: Records) => {
		return update(($store) => {
			for (const record of records) {
				$store.recordsMap[record.id.value] = record
				if (!$store.order.includes(record.id.value)) {
					$store.order = [...$store.order, record.id.value]
				}
			}
			return $store
		})
	}

	const setAllRecords = (inputs: Records) => {
		const recordsOrder = inputs.map((r) => r.id.value)
		const recordsMap = keyBy(inputs, (record) => record.id.value)

		return set({ order: recordsOrder, recordsMap })
	}

	const removeRecord = (recordId: string) => {
		return update(($store) => {
			delete $store.recordsMap[recordId]
			$store.order = $store.order.filter((id) => id !== recordId)
			return $store
		})
	}

	const removeRecords = (recordIds: string[]) => {
		return update(($store) => {
			for (const recordId of recordIds) {
				delete $store.recordsMap[recordId]
				$store.order = $store.order.filter((id) => id !== recordId)
			}
			return $store
		})
	}

	const records = derived(store, ($store) => $store.order.map((id) => $store.recordsMap[id]))
	const currentRecordIndex: Readable<number | undefined> = derived([currentRecordId, store], ([$id, $store]) => {
		$id ? $store.order.findIndex((id) => id === $id) : undefined
	})

	const nextRecord = derived([currentRecordIndex, store], ([$index, $store]) => {
		if (isUndefined($index)) return undefined
		if ($index === $store.order.length - 1) return undefined
		const id = $store.order[$index + 1]
		return $store.recordsMap[id]
	})

	const prevRecord = derived([currentRecordIndex, store], ([$index, $store]) => {
		if (isUndefined($index)) return undefined
		if ($index === 0) return undefined
		const id = $store.order[$index - 1]
		return $store.recordsMap[id]
	})

	return {
		set,
		update,
		subscribe,

		records,
		nextRecord,
		prevRecord,

		setRecord,
		setRecords,
		setAllRecords,
		removeRecord,
		removeRecords,
	}
}

export const recordsStore = createRecordStore()

export const createRecordFormId = writable<string | undefined>(undefined)
export const createRecordForm = derived([currentTable, createRecordFormId], ([$table, $formId]) =>
	$formId ? $table.forms.getById($formId).into() : undefined,
)

export const sorts = derived(currentView, (view) => view.sorts?.sorts ?? [])
// TODO: nested should be IFilters
export const filters = derived(currentView, (view) => (view.filter?.group.children ?? []) as IFilters)

export const dashboardWidgets = derived(currentView, ($view) => $view.dashboard.into()?.widgets ?? [])

export const recordHash = derived(
	[currentTable, currentView, q],
	([$table, $view, $q]) => `records:${$table.id.value}:${$view.id.value}:${$view.displayType}:${$q}`,
)

export const getGroupRecordsHash = (id: string) => derived(recordHash, ($recordHash) => $recordHash + id)

export const currentOption = writable<Option | null>()
export const getOption = () => currentOption

export const currentVisualizationId = writable<string | undefined>()
export const currentVisualization = derived(
	[currentView, currentVisualizationId],
	([$view, $currentVisualizationId]) =>
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
					{ queryHash: $recordHash, ...options, refetchOnMount: false, refetchOnWindowFocus: false },
				),
		)
		.with(
			'share.view',
			() => (filter?: IRootFilter, options?: ListRecordQueryOptions) =>
				trpc().share.viewRecords.query(
					{ viewId: $view.id.value, q: $q, filter },
					{ queryHash: $recordHash, ...options, refetchOnMount: false, refetchOnWindowFocus: false },
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

export const tableById = derived([currentTable, allTables, shareTarget], ([$table, $tables, $shareTarget]) => {
	let t: Table | undefined
	return async (tableId: string) => {
		if (tableId === $table?.id.value) {
			t = $table
		} else if ($tables) {
			const found = $tables.find((t) => t.id === tableId)
			if (found) t = TableFactory.fromQuery(found)
		} else if ($shareTarget) {
			await trpc()
				.share.table.utils.fetch({ id: tableId, target: $shareTarget })
				.then(({ table }) => {
					t = TableFactory.fromQuery(table)
				})
		}

		return t
	}
})

export const currentFLSS = writable<FLS[]>()
export const getFLSS = currentFLSS

export const updateFLSS = derived([currentFLSS, me], ([$flss, $me]) =>
	$flss.filter((fls) => fls.policy.action === 'update').filter((fls) => isFLSUserMatch($me.userId).isSatisfiedBy(fls)),
)

export const updateFieldSpec = derived([updateFLSS, me], ([$flss, $me]) => {
	const specs = $flss.map((rls) => rls.policy.getSpec($me.userId))
	return andOptions(...specs)
})

export const canUpdateRecordField = derived(
	[me, updateFLSS, currentRecord, hasPermission],
	([$me, $flss, $record, $hasPermission]) => {
		return (fieldId: string) => {
			if (!$hasPermission('record:update')) return false
			if (!$record) return false
			const flss = $flss.filter((fls) => fls.fieldId.value === fieldId)
			const spec = andOptions(...flss.map((fls) => fls.policy.getSpec($me.userId)))
			if (spec.isNone()) return true
			return spec.unwrap().isSatisfiedBy($record)
		}
	},
)

export const currentRLSS = writable<RLS[]>()
export const getRLSS = currentRLSS

export const updateRLSS = derived(currentRLSS, ($rlss) => $rlss.filter((rls) => rls.policy.action === 'update'))

export const updateSpec = derived([updateRLSS, me], ([$rlss, $me]) => {
	const specs = $rlss
		.filter((rls) => isUserMatch($me.userId).isSatisfiedBy(rls))
		.map((rls) => rls.policy.getSpec($me.userId))
	return andOptions(...specs)
})

export const canUpdateRecord = derived(
	[updateSpec, currentRecord, hasPermission],
	([$spec, $record, $hasPermission]) => {
		if (!$hasPermission('record:update')) return false
		if (!$record) return false
		if ($spec.isNone()) return true
		return $spec.unwrap().isSatisfiedBy($record)
	},
)

export const deleteRLSS = derived(currentRLSS, ($rlss) => $rlss.filter((rls) => rls.policy.action === 'delete'))

export const deleteSpec = derived([deleteRLSS, me], ([$rlss, $me]) => {
	const specs = $rlss
		.filter((rls) => isUserMatch($me.userId).isSatisfiedBy(rls))
		.map((rls) => rls.policy.getSpec($me.userId))
	return andOptions(...specs)
})

export const canDeleteRecord = derived(
	[deleteSpec, currentRecord, hasPermission],
	([$spec, $record, $hasPermission]) => {
		if (!$hasPermission('record:delete')) return false
		if (!$record) return false
		if ($spec.isNone()) return true
		return $spec.unwrap().isSatisfiedBy($record)
	},
)

export const createRLSS = derived(currentRLSS, ($rlss) => $rlss.filter((rls) => rls.policy.action === 'create'))

export const createSpec = derived([createRLSS, me], ([$rlss, $me]) => {
	const specs = $rlss
		.filter((rls) => isUserMatch($me.userId).isSatisfiedBy(rls))
		.map((rls) => rls.policy.getSpec($me.userId))
	return andOptions(...specs)
})

export const canCreateRecord = derived(
	[createSpec, currentRecord, hasPermission],
	([$spec, $record, $hasPermission]) => {
		if (!$hasPermission('record:create')) return false
		if (!$record) return false
		if ($spec.isNone()) return true
		return $spec.unwrap().isSatisfiedBy($record)
	},
)

export const readonly = derived(isShare, ($isShare) => $isShare)

export const readonlyRecord = derived(
	[readonly, canUpdateRecord],
	([$readonly, $canUpdateRecord]) => $readonly || !$canUpdateRecord,
)

export const currentBaseId = derived(
	[page, currentTable],
	([$page, $table]) => $page.params.baseId ?? $table?.baseId.into()?.value ?? '',
)

export const createTableDefaultValue = writable<Partial<ICreateTableInput> | undefined>()

export const firstTableOfBase = derived(
	[allTables],
	([$tables]) =>
		(baseId: string) =>
			$tables?.find((table) => table.baseId === baseId),
)

export const currentBase = derived([allBases, currentBaseId], ([$bases, $baseId]) =>
	$bases.find((base) => base.id === $baseId),
)

export const getBaseById = derived(
	[allBases],
	([$bases]) =>
		(baseId: string) =>
			$bases.find((base) => base.id === baseId),
)

export const baseTables = derived(
	[allTables],
	([$tables]) =>
		(baseId: string) =>
			$tables?.filter((table) => table.baseId === baseId),
)
