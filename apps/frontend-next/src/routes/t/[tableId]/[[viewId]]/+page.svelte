<script lang="ts">
	import { RecordFactory, TableFactory, type PinnedPosition, type Field } from '@undb/core'
	import { RevoGrid } from '@revolist/svelte-datagrid'
	import type { RevoGrid as RevoGridType } from '@revolist/revogrid/dist/types/interfaces'
	import type { Components, RevoGridCustomEvent } from '@revolist/revogrid'
	import { defineCustomElements } from '@revolist/revogrid/loader'
	import type { PageData } from './$types'
	import { cellTemplateMap } from '$lib/cell/cell-template'
	import { trpc } from '$lib/trpc/client'
	import { page } from '$app/stores'
	import { writable } from 'svelte/store'
	import { onMount } from 'svelte'

	export let data: PageData

	const pinnedPositionMap: Record<PinnedPosition, RevoGridType.DimensionColPin> = {
		left: 'colPinStart',
		right: 'colPinEnd',
	}

	$: table = TableFactory.fromQuery(data.table)
	$: view = table.mustGetView()
	$: records = RecordFactory.fromQueryRecords(data.records, table.schema.toIdMap())

	let rows: Components.RevoGrid['source']
	let columns: Components.RevoGrid['columns']

	const select = writable<Record<string, boolean>>({})
	$: data.table, select.set({})

	const updateSelect = (recordId: string, selected: boolean) => ($select[recordId] = selected)
	$: allSelected = Object.entries($select).filter(([, value]) => value).length === records.length
	const updateAllSelect = (s: boolean) => {
		const selected: Record<string, boolean> = {}
		for (const record of records) {
			selected[record.id.value] = s
		}

		select.set(selected)
	}

	$: {
		defineCustomElements().then(() => {
			rows = records.map((record) => record.valuesJSON)
			columns = [
				{
					prop: 'selection',
					pin: 'colPinStart',
					readonly: true,
					columnProperties: () => {
						return {
							class: '!p-0 text-center border-r border-b border-gray-200',
						}
					},
					columnTemplate: (h, props) => {
						return h('input', {
							type: 'checkbox',
							checked: allSelected,
							onChange: (event: any) => {
								updateAllSelect(event.target.checked)
							},
							class:
								'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 justify-self-center self-center',
						})
					},
					cellProperties: () => ({
						class: '!p-0 text-center border-r border-b border-gray-200',
					}),
					cellTemplate: (h, props) => {
						return h('input', {
							type: 'checkbox',
							checked: !!$select[props.model.id],
							onChange: (event: any) => {
								updateSelect(props.model.id, event.target.checked)
							},
							class:
								'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 justify-self-center self-center',
						})
					},
					size: 40,
				},
				...table.schema.fields.map<Components.RevoGrid['columns'][0]>((field) => {
					const position = view.pinnedFields?.getPinnedPosition(field.id.value)
					return {
						prop: field.id.value,
						name: field.name.value,
						size: view.getFieldWidth(field.id.value),
						pin: position ? pinnedPositionMap[position] : undefined,
						autoSize: true,
						cellTemplate: cellTemplateMap[field.type],
						columnProperties: () => ({
							class: 'border-r border-b border-gray-200',
						}),
						cellProperties: ({ prop, model, data, column }) => {
							return {
								class: 'flex items-center border-r border-b border-gray-100',
							}
						},
						field,
					}
				}),
			]
		})
	}

	const onAfterColumnResize = async (
		event: RevoGridCustomEvent<Record<RevoGridType.ColumnProp, RevoGridType.ColumnRegular>>,
	) => {
		for (const [fieldId, field] of Object.entries(event.detail)) {
			const width = field.size
			if (width && view.getFieldWidth(fieldId) !== width) {
				await trpc($page).table.view.field.setWidth.mutate({
					tableId: table.id.value,
					fieldId,
					viewId: view.id.value,
					width,
				})
			}
		}
	}
</script>

<RevoGrid source={rows} resize="true" {columns} theme="compact" on:aftercolumnresize={onAfterColumnResize} range />
