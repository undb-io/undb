<script lang="ts">
	import type { IViewPinnedFields, PinnedPosition } from '@undb/core'
	import cx from 'classnames'
	import { RevoGrid } from '@revolist/svelte-datagrid'
	import { Button, Dropdown, P, Spinner, Toast } from 'flowbite-svelte'
	import type { Edition, RevoGrid as RevoGridType } from '@revolist/revogrid/dist/types/interfaces'
	import type { Components, RevoGridCustomEvent } from '@revolist/revogrid'
	import { defineCustomElements } from '@revolist/revogrid/loader'
	import { cellTemplateMap } from '$lib/cell/cell-template'
	import { trpc } from '$lib/trpc/client'
	import { page } from '$app/stores'
	import { slide } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	import { writable } from 'svelte/store'
	import EmptyTable from './EmptyTable.svelte'
	import { currentFieldId, getRecords, getTable, getView } from '$lib/store/table'
	import { goto, invalidate } from '$app/navigation'
	import FieldMenu from '$lib/field/FieldMenu.svelte'
	import Portal from 'svelte-portal'
	import { getIconClass } from '$lib/field/helpers'
	import { onMount } from 'svelte'

	const pinnedPositionMap: Record<PinnedPosition, RevoGridType.DimensionColPin> = {
		left: 'colPinStart',
		right: 'colPinEnd',
	}

	const table = getTable()
	const view = getView()
	const records = getRecords()

	const getFieldDomId = (fieldId?: string | number) => (fieldId ? `field_menu_${fieldId}` : undefined)
	$: fieldMenuDOMId = getFieldDomId($currentFieldId)

	let rows: Components.RevoGrid['source']
	let columns = writable<RevoGridType.ColumnRegular[]>([])

	const select = writable<Record<string, boolean>>({})
	$: $table, select.set({})

	const updateSelect = (recordId: string, selected: boolean) => ($select[recordId] = selected)
	$: allSelected =
		$records.length > 0 && Object.entries($select).filter(([, value]) => value).length === $records.length
	const updateAllSelect = (s: boolean) => {
		const selected: Record<string, boolean> = {}
		for (const record of $records) {
			selected[record.id.value] = s
		}

		select.set(selected)
	}

	$: fields = $table.getOrderedFields($view)

	onMount(async () => {
		await defineCustomElements()
	})

	let row: HTMLElement | undefined | null
	function handleRevogrid(grid: RevoGrid) {
		// @ts-ignore
		const gridInstance = grid.getWebComponent() as HTMLRevoGridElement | undefined
		if (gridInstance) {
			gridInstance.addEventListener('mousemove', (e) => {
				// @ts-ignore
				const ele = e.toElement as HTMLElement
				if (ele) {
					const cell = ele.closest('.rgCell')
					const id = cell?.getAttribute('data-record-id') ?? undefined
					const elements = gridInstance.querySelectorAll('.rgRow')
					for (const element of elements) {
						element.classList.remove('hovered', 'bg-gray-100')
					}
					const rows = gridInstance.querySelectorAll(`.${id}`)
					for (const row of rows) {
						row.classList.add('hovered', 'bg-gray-100')
					}
				}
			})
		}
	}
	let grid: RevoGrid
	$: if (grid) handleRevogrid(grid)
	$: if (grid) {
		rows = $records.map((record) => record.valuesJSON)
	}

	$: if (grid) {
		columns.set([
			{
				prop: 'selection',
				pin: 'colPinStart',
				columnProperties: () => {
					return {
						class:
							'!p-0 relative text-center border-r border-b border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-50',
					}
				},
				columnTemplate: (h) => {
					return h('input', {
						type: 'checkbox',
						checked: allSelected,
						disabled: !$records.length,
						onChange: (event: any) => {
							updateAllSelect(event.target.checked)
						},
						class:
							'w-4 h-4 text-blue-600 absolute top-1/2 left-1/4 translate-y-[-50%] translate-x-[-50%] bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 justify-self-center self-center',
					})
				},
				cellProperties: (cell) => ({
					'data-record-id': cell.model.id,
					class: '!p-0 text-center border-r border-b border-gray-200 group',
				}),
				cellTemplate: (h, props) => {
					const checked = !!$select[props.model.id]
					return h('div', { class: 'flex items-center h-full' }, [
						h(
							'span',
							{
								class: cx(
									'undb-row-index relative basis-[50%] text-gray-400 text-xs opacity-100 text-ellipsis whitespace-nowrap group-hover:hidden',
									checked && 'hidden',
								),
							},
							String(props.rowIndex + 1),
						),
						h(
							'button',
							{
								onClick: () => expand(props.model.id),
								class: cx(
									'undb-row-expand absolute w-6 h-6 rounded-full hover:bg-blue-100 top-1/2 left-3/4 translate-y-[-50%] translate-x-[-50%] text-xs opacity-0 text-gray-400',
								),
							},
							h('i', { class: 'ti ti-arrows-diagonal' }),
						),
						h('input', {
							type: 'checkbox',
							checked,
							onChange: (event: any) => {
								updateSelect(props.model.id, event.target.checked)
							},
							class: cx(
								'undb-select absolute top-1/2 left-1/4 translate-y-[-50%] translate-x-[-50%] w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 justify-self-center self-center group-hover:opacity-100',
								!checked && 'opacity-0',
							),
						}),
					])
				},
				size: 80,
			},
			...fields.map<Components.RevoGrid['columns'][0]>((field) => {
				const position = $view.pinnedFields?.getPinnedPosition(field.id.value)
				return {
					prop: field.id.value,
					name: field.name.value,
					size: $view.getFieldWidth(field.id.value),
					pin: position ? pinnedPositionMap[position] : undefined,
					autoSize: true,
					cellTemplate: cellTemplateMap[field.type],
					columnTemplate: (h, column) => {
						const id = getFieldDomId(column.prop)
						return h(
							'div',
							{
								class: 'inline-flex w-full justify-between items-center text-xs text-gray-700 font-medium',
							},
							[
								h(
									'div',
									{
										class: 'space-x-2',
									},
									[h('i', { class: cx(getIconClass(column.field.type), 'text-gray-600') }), h('span', {}, column.name)],
								),
								h(
									'button',
									{
										id,
										onClick: () => {
											currentFieldId.set(column.prop as string)
										},
										class: 'w-[24px] h-[24px] rounded-sm hover:bg-gray-200 inline-flex items-center justify-center',
									},
									h('i', {
										class: 'ti ti-chevron-down text-gray-500',
									}),
								),
							],
						)
					},
					columnProperties: (column: RevoGridType.ColumnRegular) => {
						const sort = $view.getFieldSort(column.prop as string).into()
						return {
							class: cx(
								'border-r border-b border-gray-300 hover:bg-gray-50 transition-[background] group flex justify-between bg-gray-100 !px-2',
								{
									'bg-blue-50': !!sort,
								},
							),
						}
					},
					cellProperties: (cell) => {
						return {
							'data-record-id': cell.model.id,
							class: 'flex items-center border-r border-b border-gray-100',
						}
					},
					field,
				}
			}),
		])
	}

	$: pinned = $view.pinnedFields?.toJSON() ?? { left: [], right: [] }

	async function togglePin(fieldId: string) {
		const column = $columns.find((c) => c.prop === fieldId)
		if (!column) return

		columns.update((columns) => {
			return columns.map((column) => {
				if (column.prop === fieldId) {
					return { ...column, pin: column.pin === 'colPinStart' ? undefined : 'colPinStart' }
				}
				return column
			})
		})

		const left = $columns.filter((c) => !!c.field && c.pin === 'colPinStart').map((c) => c.prop as string)
		const pinnedFields: IViewPinnedFields = { left, right: pinned.right }

		await trpc($page).table.view.field.setPinned.mutate({
			tableId: $table.id.value,
			pinnedFields,
			viewId: $view.id.value,
		})

		await invalidate(`table:${$table.id.value}`)
		currentFieldId.set(undefined)
	}

	const expand = (recordId: string) => {
		const search = new URLSearchParams($page.url.searchParams)
		const r = search.get('r')
		if (r !== recordId) {
			search.set('r', recordId)
			goto(`?${search.toString()}`)
		}
	}

	const onAfterColumnResize = async (
		event: RevoGridCustomEvent<Record<RevoGridType.ColumnProp, RevoGridType.ColumnRegular>>,
	): Promise<void> => {
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

			await invalidate(`records:${$table.id.value}`)

			select.set({})
		} finally {
			loadingDuplicate = false
		}
	}
</script>

<div class:h-[32px]={!hasRecord} class:h-full={hasRecord}>
	<RevoGrid
		bind:this={grid}
		source={rows}
		resize="true"
		columns={$columns}
		theme="compact"
		range
		readonly
		rowClass="id"
		on:aftercolumnresize={onAfterColumnResize}
	/>
</div>
{#if !hasRecord}
	<EmptyTable />
{/if}
<Toast
	open={toastOpen}
	position="bottom-right"
	class="z-30 shadow-md !w-[500px] !max-w-xl"
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

{#if fieldMenuDOMId}
	{#key fieldMenuDOMId}
		<Portal target="body">
			<Dropdown
				open
				triggeredBy={`#${fieldMenuDOMId}`}
				class="w-[250px] shadow-lg border border-gray-200 rounded-md py-1"
			>
				<FieldMenu {togglePin} />
			</Dropdown>
		</Portal>
	{/key}
{/if}

<style>
	:global(revo-grid[theme='compact'] revogr-header .header-rgRow) {
		height: 32px;
	}

	:global(revo-grid[theme='compact'] revogr-header) {
		line-height: 32px;
	}

	:global(revo-grid .hovered .undb-select) {
		opacity: 1;
	}

	:global(revo-grid .hovered .undb-row-expand) {
		opacity: 1;
	}

	:global(revo-grid .hovered .undb-row-index) {
		display: none;
	}
</style>
