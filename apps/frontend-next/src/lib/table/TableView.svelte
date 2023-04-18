<script lang="ts">
	import type { PinnedPosition, Records } from '@undb/core'
	import { RevoGrid } from '@revolist/svelte-datagrid'
	import { Button, P, Spinner, Toast } from 'flowbite-svelte'
	import type { RevoGrid as RevoGridType } from '@revolist/revogrid/dist/types/interfaces'
	import type { Components, RevoGridCustomEvent } from '@revolist/revogrid'
	import { defineCustomElements } from '@revolist/revogrid/loader'
	import { cellTemplateMap } from '$lib/cell/cell-template'
	import { trpc } from '$lib/trpc/client'
	import { page } from '$app/stores'
	import { slide } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	import { writable } from 'svelte/store'
	import EmptyTable from './EmptyTable.svelte'
	import { getRecords, getTable, getView } from '$lib/context'

	const pinnedPositionMap: Record<PinnedPosition, RevoGridType.DimensionColPin> = {
		left: 'colPinStart',
		right: 'colPinEnd',
	}

	const table = getTable()
	const view = getView()
	const records = getRecords()

	let rows: Components.RevoGrid['source']
	let columns: Components.RevoGrid['columns']

	const select = writable<Record<string, boolean>>({})
	$: $table, select.set({})

	const updateSelect = (recordId: string, selected: boolean) => ($select[recordId] = selected)
	$: allSelected = Object.entries($select).filter(([, value]) => value).length === $records.length
	const updateAllSelect = (s: boolean) => {
		const selected: Record<string, boolean> = {}
		for (const record of $records) {
			selected[record.id.value] = s
		}

		select.set(selected)
	}

	$: {
		defineCustomElements().then(() => {
			rows = $records.map((record) => record.valuesJSON)
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
					columnTemplate: (h) => {
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
				...$table.schema.fields.map<Components.RevoGrid['columns'][0]>((field) => {
					const position = $view.pinnedFields?.getPinnedPosition(field.id.value)
					return {
						prop: field.id.value,
						name: field.name.value,
						size: $view.getFieldWidth(field.id.value),
						pin: position ? pinnedPositionMap[position] : undefined,
						autoSize: true,
						cellTemplate: cellTemplateMap[field.type],
						columnProperties: () => ({
							class: 'border-r border-b border-gray-200',
						}),
						cellProperties: () => {
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
			if (width && $view.getFieldWidth(fieldId) !== width) {
				await trpc($page).table.view.field.setWidth.mutate({
					tableId: $table.id.value,
					fieldId,
					viewId: $view.id.value,
					width,
				})
			}
		}
	}

	$: selectedRecords = Object.entries($select)
		.filter(([, value]) => value)
		.map(([key]) => key)
	$: selectedCount = Object.values($select).filter(Boolean).length
	$: hasRecord = !!$records.length
	$: toastOpen = !!selectedCount

	let loadingDuplicate = false
	const duplicateRecords = async () => {
		if (!selectedRecords.length) {
			return
		}

		try {
			loadingDuplicate = true
			await trpc($page).record.bulkDuplicate.mutate({
				tableId: $table.id.value,
				ids: selectedRecords as [string, ...string[]],
			})
		} finally {
			loadingDuplicate = false
		}
	}
</script>

{#if hasRecord}
	<RevoGrid source={rows} resize="true" {columns} theme="compact" on:aftercolumnresize={onAfterColumnResize} range />
{:else}
	<div class="h-[50px]">
		<RevoGrid source={rows} resize="true" {columns} theme="compact" on:aftercolumnresize={onAfterColumnResize} range />
	</div>
{/if}
{#if !hasRecord}
	<EmptyTable />
{/if}
<Toast
	open={toastOpen}
	position="bottom-right"
	class="z-30 shadow-md max-w-md"
	transition={slide}
	params={{ delay: 100, duration: 200, easing: quintOut }}
>
	<div class="flex items-center space-x-5 justify-between">
		<P>selected {selectedCount} records</P>
		<Button color="alternative" size="xs" on:click={duplicateRecords}>
			{#if loadingDuplicate}
				<Spinner class="mr-3" size="4" />
			{/if}
			Duplicate records</Button
		>
	</div>
</Toast>
