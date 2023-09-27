<script lang="ts">
	import { RecordFactory, type IViewPinnedFields, type PinnedPosition, type IViewRowHeight } from '@undb/core'
	import { clickOutside, cn } from '$lib/utils'
	import { RevoGrid } from '@revolist/svelte-datagrid'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import type { RevoGrid as RevoGridType } from '@revolist/revogrid/dist/types/interfaces'
	import type { Components, RevoGridCustomEvent } from '@revolist/revogrid'
	import { defineCustomElements } from '@revolist/revogrid/loader'
	import { cellTemplateMap } from '$lib/cell/CellComponents/cell-template'
	import { trpc } from '$lib/trpc/client'
	import { writable } from 'svelte/store'
	import EmptyTable from './EmptyTable.svelte'
	import {
		currentFieldId,
		currentFieldMenuRect,
		currentRecordId,
		getField,
		getTable,
		getView,
		listRecordFn,
		readonly,
		recordsStore,
	} from '$lib/store/table'
	import { invalidate } from '$app/navigation'
	import FieldMenu from '$lib/field/FieldMenu.svelte'
	import { onMount, tick } from 'svelte'
	import { editors } from '$lib/cell/CellEditors/editors'
	import { t } from '$lib/i18n'
	import { confirmDeleteField, createFieldModal } from '$lib/store/modal'
	import LoadingTable from './LoadingTable.svelte'
	import TableViewToast from './TableViewToast.svelte'
	import { recordSelection, selectedCount, selectedRecords } from '$lib/store/record'
	import { getColumnTemplate } from '$lib/field/field-template'
	import { hasPermission } from '$lib/store/authz'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import ConfirmBulkDeleteRecord from '$lib/record/ConfirmBulkDeleteRecord.svelte'
	import ConfirmBulkDuplicateRecord from '$lib/record/ConfirmBulkDuplicateRecord.svelte'
	import htm from 'htm'

	const pinnedPositionMap: Record<PinnedPosition, RevoGridType.DimensionColPin> = {
		left: 'colPinStart',
		right: 'colPinEnd',
	}

	const table = getTable()
	const view = getView()

	$: rowHeight = $view.rowHeight?.unpack() ?? 'short'

	const heights: Record<IViewRowHeight, number> = {
		short: 32,
		medium: 55,
		tall: 88,
	}
	$: rowSize = heights[rowHeight]

	$: data = $listRecordFn()

	$: recordsStore.setAllRecords(RecordFactory.fromQueryRecords($data.data?.records ?? [], $table.schema.toIdMap()))
	$: records = recordsStore.records

	const field = getField()

	const getFieldDomId = (fieldId?: string | number) => (fieldId ? `field_menu_${fieldId}` : undefined)
	$: fieldMenuDOMId = getFieldDomId($currentFieldId)

	let rows: Components.RevoGrid['source']
	let rowDefinitions: RevoGridType.RowDefinition[]
	let columns = writable<RevoGridType.ColumnRegular[]>([])

	$: $table, recordSelection.reset()
	$: allSelected =
		$records.length > 0 && Object.entries($recordSelection).filter(([, value]) => value).length === $records.length
	$: fields = $table.getOrderedFields($view, false)

	onMount(async () => {
		await defineCustomElements()
	})

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
		rowDefinitions = $records.map((_, index) => ({ type: 'rgRow', index, size: rowSize }))
	}

	$: if (grid) {
		const cols: RevoGridType.ColumnRegular[] = [
			{
				prop: 'selection',
				pin: 'colPinStart',
				columnProperties: () => {
					return {
						class:
							'!p-0 relative text-center border-r border-b border-gray-300 flex items-center justify-center bg-gray-100 hover:bg-gray-50 dark:bg-gray-600 dark:border-gray-500',
					}
				},
				columnTemplate: (h) => {
					return h('input', {
						type: 'checkbox',
						checked: allSelected,
						disabled: !$records.length,
						onChange: (event: any) => {
							recordSelection.updateAll($records, event.target.checked)
						},
						class: cn(
							'w-4 h-4 text-primary absolute top-1/2 left-1/4 translate-y-[-50%] translate-x-[-50%] bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 justify-self-center self-center dark:!bg-gray-200 dark:border-gray-300',
							$readonly && 'hidden',
						),
					})
				},
				cellProperties: (cell) => ({
					'data-record-id': cell.model.id,
					class: '!p-0 text-center border-r border-b border-gray-200 group dark:border-gray-500',
				}),
				cellTemplate: (h, props) => {
					const checked = !!$recordSelection[props.model.id]
					return h('div', { class: 'flex items-center h-full' }, [
						h(
							'span',
							{
								class: cn(
									'undb-row-index relative basis-[50%] text-gray-400 text-xs opacity-100 text-ellipsis whitespace-nowrap dark:text-gray-100 ',
									checked && 'hidden',
									{
										'group-hover:hidden': !$readonly,
									},
								),
							},
							String(props.rowIndex + 1),
						),
						h(
							'button',
							{
								onClick: () => expand(props.model.id),
								class: cn(
									'undb-row-expand absolute w-6 h-6 rounded-full hover:bg-primary-100 dark:hover:bg-primary-500 top-1/2 left-3/4 translate-y-[-50%] translate-x-[-50%] text-xs opacity-0 text-gray-400 dark:text-gray-100 ',
								),
							},
							h('i', { class: 'ti ti-arrows-diagonal' }),
						),
						h('input', {
							type: 'checkbox',
							checked,
							onChange: (event: any) => {
								recordSelection.updateSelect(props.model.id, event.target.checked)
							},
							class: cn(
								'absolute top-1/2 left-1/4 translate-y-[-50%] translate-x-[-50%] w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 justify-self-center self-center opacity-0',
								{
									// hover row to toggle opacity
									'undb-select': !$readonly,
									'opacity-100': checked,
								},
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
					editor: field.type,
					size: $view.getFieldWidth(field.id.value),
					pin: position ? pinnedPositionMap[position] : undefined,
					autoSize: true,
					cellTemplate: cellTemplateMap[field.type],
					columnTemplate: (h, c) => getColumnTemplate(h, c, $readonly),
					columnProperties: (column: RevoGridType.ColumnRegular) => {
						const sort = $view.getFieldSort(column.prop as string).into()
						return {
							'data-field-id': column.field.id.value,
							class: cn(
								'border-r border-b border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-600 dark:border-gray-500  transition-[background] group flex justify-between bg-gray-100 !px-2',
								{
									'bg-primary-50': !!sort,
								},
							),
						}
					},
					cellProperties: (cell) => {
						return {
							'data-record-id': cell.model.id,
							class: 'flex items-center border-r border-b border-gray-100 dark:border-gray-500 dark:!text-gray-200',
						}
					},
					field,
					table: $table,
				}
			}),
		]

		if (!$readonly) {
			cols.push({
				prop: 'createColumn',
				autoSize: true,
				columnProperties: () => {
					return {
						class: cn(
							'!p-0 cursor-pointer text-center border-r border-b border-gray-300 flex items-stretch bg-gray-100 hover:bg-gray-50 dark:bg-gray-600 dark:border-gray-500',
							$readonly && 'hidden',
						),
					}
				},
				columnTemplate: (h) => {
					return h(
						'button',
						{
							class: cn('flex items-center justify-center w-full h-full', $readonly && 'hidden'),
							onClick: () => {
								createFieldModal.open()
							},
						},
						h('i', {
							class: 'ti ti-plus font-bold',
						}),
					)
				},
				cellTemplate: () => null,
				size: $readonly ? 0 : 80,
			})
		}
		columns.set(cols)
	}

	$: pinned = $view.pinnedFields?.toJSON() ?? { left: [], right: [] }

	const pin = trpc().table.view.field.setPinned.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			currentFieldId.set(undefined)
		},
	})
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

		$pin.mutate({
			tableId: $table.id.value,
			pinnedFields,
			viewId: $view.id.value,
		})
	}

	const expand = async (recordId: string) => {
		await tick()
		currentRecordId.set(recordId)
	}

	const setWidth = trpc().table.view.field.setWidth.mutation()
	const onAfterColumnResize = async (
		event: RevoGridCustomEvent<Record<RevoGridType.ColumnProp, RevoGridType.ColumnRegular>>,
	): Promise<void> => {
		if ($readonly) return
		for (const [fieldId, f] of Object.entries(event.detail)) {
			const width = f.size
			if (width && $view.getFieldWidth(fieldId) !== width) {
				$setWidth.mutate({
					tableId: $table.id.value,
					fieldId,
					viewId: $view.id.value,
					width,
				})
			}
		}
	}

	$: hasRecord = !!$records.length

	const deleteField = trpc().table.field.delete.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			$confirmDeleteField = false
		},
	})

	let isLoading = false
	if ($data?.isLoading) {
		setTimeout(() => {
			isLoading = true
		}, 300)
	}

	let menu: HTMLButtonElement
	$: if (fieldMenuDOMId && $currentFieldMenuRect && menu) {
		menu.click()
	}
</script>

<div class="h-full w-full relative">
	<RevoGrid
		bind:this={grid}
		source={rows}
		resize="true"
		columns={$columns}
		theme="compact"
		range
		rowClass="id"
		readonly
		{rowDefinitions}
		{editors}
		on:aftercolumnresize={onAfterColumnResize}
	/>
	{#if isLoading}
		<div class="absolute top-0 left-0">
			<LoadingTable />
		</div>
	{:else if !hasRecord && $data.isSuccess}
		<div class="absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[-70%] z-[9]">
			<EmptyTable />
		</div>
	{/if}
</div>

{#if !$readonly}
	<TableViewToast open={!!$selectedCount} />
{/if}

{#if fieldMenuDOMId && $currentFieldMenuRect}
	{#key fieldMenuDOMId}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				class="fixed"
				style={`left: ${$currentFieldMenuRect.left}px; right: ${$currentFieldMenuRect.right}px; top: ${$currentFieldMenuRect.top}px; bottom: ${$currentFieldMenuRect.bottom}px`}
			>
				<button bind:this={menu} class="hidden" tabindex="-1"></button>
			</DropdownMenu.Trigger>
			{#if $hasPermission('table:update_field')}
				<DropdownMenu.Content asChild>
					<div
						use:clickOutside
						on:click_outside={() => currentFieldId.set(undefined)}
						class="fixed w-56 bg-white dark:bg-gray-600 border dark:border-gray-400 py-1 rounded-sm shadow-sm z-[999999999]"
						style={`left: ${$currentFieldMenuRect.left - 90}px; top: ${$currentFieldMenuRect.top + 30}px;`}
					>
						<FieldMenu {togglePin} />
					</div>
				</DropdownMenu.Content>
			{/if}
		</DropdownMenu.Root>
	{/key}
{/if}

<ConfirmBulkDeleteRecord />
<ConfirmBulkDuplicateRecord />

<AlertDialog.Root bind:open={$confirmDeleteField}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{$t('Confirm Delete Field')}</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel on:click={() => ($confirmDeleteField = false)}>
				{$t('Confirm No', { ns: 'common' })}
			</AlertDialog.Cancel>
			<AlertDialog.Action
				variant="destructive"
				on:click={() => {
					if ($field) {
						$deleteField.mutate({ tableId: $table.id.value, id: $field.id.value })
					}
				}}
			>
				{$t('Confirm Yes', { ns: 'common' })}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

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

	:global(revogr-header .header-rgRow) {
		background-color: #f7f7f7;
	}
	:global(.dark revogr-header .header-rgRow) {
		background-color: #374151;
	}

	:global(revogr-header .rgHeaderCell > .resizable-r) {
		width: 2px;
	}

	:global(revogr-focus) {
		border: 1px solid transparent;
	}

	:global(.dark .hovered) {
		background-color: var(--primary-color) !important;
	}

	:global(.dark revogr-data .rgRow.focused-rgRow) {
		background-color: #374151 !important;
	}

	:global(.dark revo-grid[theme='compact'] revogr-header .rgHeaderCell.focused-cell) {
		background-color: #374151 !important;
	}
</style>
