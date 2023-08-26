<script lang="ts">
	import { RecordFactory, type IViewPinnedFields, type PinnedPosition, type IViewRowHeight } from '@undb/core'
	import cx from 'classnames'
	import { RevoGrid } from '@revolist/svelte-datagrid'
	import { Button, Dropdown, Modal, Spinner } from 'flowbite-svelte'
	import type { RevoGrid as RevoGridType } from '@revolist/revogrid/dist/types/interfaces'
	import type { Components, RevoGridCustomEvent } from '@revolist/revogrid'
	import { defineCustomElements } from '@revolist/revogrid/loader'
	import { cellTemplateMap } from '$lib/cell/CellComponents/cell-template'
	import { trpc } from '$lib/trpc/client'
	import { writable } from 'svelte/store'
	import EmptyTable from './EmptyTable.svelte'
	import {
		currentFieldId,
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
	import { confirmBulkDeleteRecords, confirmDeleteField } from '$lib/store/modal'
	import LoadingTable from './LoadingTable.svelte'
	import TableViewToast from './TableViewToast.svelte'
	import { recordSelection, selectedCount, selectedRecords } from '$lib/store/record'
	import { getColumnTemplate } from '$lib/field/field-template'
	import { hasPermission } from '$lib/store/authz'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'

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
		columns.set([
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
						class:
							'w-4 h-4 text-blue-600 absolute top-1/2 left-1/4 translate-y-[-50%] translate-x-[-50%] bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 justify-self-center self-center dark:!bg-gray-200 dark:border-gray-300',
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
								class: cx(
									'undb-row-index relative basis-[50%] text-gray-400 text-xs opacity-100 text-ellipsis whitespace-nowrap group-hover:hidden dark:text-gray-100 ',
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
									'undb-row-expand absolute w-6 h-6 rounded-full hover:bg-blue-100 dark:hover:bg-blue-500 top-1/2 left-3/4 translate-y-[-50%] translate-x-[-50%] text-xs opacity-0 text-gray-400 dark:text-gray-100 ',
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
							class: cx(
								'border-r border-b border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-600 dark:border-gray-500  transition-[background] group flex justify-between bg-gray-100 !px-2',
								{
									'bg-blue-50': !!sort,
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
		])
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

	const bulkDeleteRecordsMutation = trpc().record.bulkDelete.mutation({
		async onSuccess(data, variables, context) {
			recordSelection.set({})
		},
	})

	const bulkDeleteRecords = async () => {
		if (!$selectedRecords.length) {
			return
		}

		$bulkDeleteRecordsMutation.mutate({
			tableId: $table.id.value,
			ids: $selectedRecords as [string, ...string[]],
		})
		$confirmBulkDeleteRecords = false
	}

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
</script>

<div class="h-full relative">
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

{#if fieldMenuDOMId}
	{#key fieldMenuDOMId}
		<Dropdown
			style="z-index: 50;"
			open
			triggeredBy={`#${fieldMenuDOMId}`}
			class="w-[250px] border border-gray-200 dark:border-0 dark:shadow-md rounded-md z-[99999]"
		>
			{#if $hasPermission('table:update_field')}
				<FieldMenu {togglePin} />
			{/if}
		</Dropdown>
	{/key}
{/if}

<Modal bind:open={$confirmBulkDeleteRecords} size="xs">
	<div class="text-center">
		<svg
			aria-hidden="true"
			class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:!text-gray-200">
			{$t('Confirm Delete Record')}
		</h3>
		<Button
			color="red"
			class="mr-2 gap-2 whitespace-nowrap"
			disabled={$bulkDeleteRecordsMutation.isLoading}
			on:click={bulkDeleteRecords}
		>
			{#if $bulkDeleteRecordsMutation.isLoading}
				<Spinner size="xs" />
			{:else}
				<i class="ti ti-circle-check text-lg" />
			{/if}
			{$t('Confirm Yes', { ns: 'common' })}</Button
		>
		<Button color="alternative">{$t('Confirm No', { ns: 'common' })}</Button>
	</div>
</Modal>

{#if $confirmDeleteField}
	<AlertDialog.Root bind:open={$confirmDeleteField}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>{$t('Confirm Delete Field')}</AlertDialog.Title>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>{$t('Confirm No', { ns: 'common' })}</AlertDialog.Cancel>
				<AlertDialog.Action
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
