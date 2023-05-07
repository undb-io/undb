<script lang="ts">
	import { RecordFactory, type IViewPinnedFields, type PinnedPosition } from '@undb/core'
	import cx from 'classnames'
	import { RevoGrid } from '@revolist/svelte-datagrid'
	import { Button, Dropdown, Modal, P, Spinner, Toast } from 'flowbite-svelte'
	import type { RevoGrid as RevoGridType } from '@revolist/revogrid/dist/types/interfaces'
	import type { Components, RevoGridCustomEvent } from '@revolist/revogrid'
	import { defineCustomElements } from '@revolist/revogrid/loader'
	import { cellTemplateMap } from '$lib/cell/CellComponents/cell-template'
	import { trpc } from '$lib/trpc/client'
	import { slide } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'
	import { writable } from 'svelte/store'
	import EmptyTable from './EmptyTable.svelte'
	import {
		currentFieldId,
		currentRecordId,
		currentRecords,
		getField,
		getTable,
		getView,
		recordHash,
	} from '$lib/store/table'
	import { invalidate } from '$app/navigation'
	import FieldMenu from '$lib/field/FieldMenu.svelte'
	import Portal from 'svelte-portal'
	import { getIconClass } from '$lib/field/helpers'
	import { onMount, tick } from 'svelte'
	import { editors } from '$lib/cell/CellEditors/editors'
	import { t } from '$lib/i18n'
	import { confirmDeleteField } from '$lib/store/modal'
	import LoadingTable from './LoadingTable.svelte'

	const pinnedPositionMap: Record<PinnedPosition, RevoGridType.DimensionColPin> = {
		left: 'colPinStart',
		right: 'colPinEnd',
	}

	const table = getTable()
	const view = getView()
	$: data = trpc().record.list.query(
		{ tableId: $table.id.value, viewId: $view.id.value },
		{ refetchOnMount: false, refetchOnWindowFocus: true, queryHash: $recordHash },
	)
	$: records = RecordFactory.fromQueryRecords($data.data?.records ?? [], $table.schema.toIdMap())
	$: $currentRecords = records
	const field = getField()

	const getFieldDomId = (fieldId?: string | number) => (fieldId ? `field_menu_${fieldId}` : undefined)
	$: fieldMenuDOMId = getFieldDomId($currentFieldId)

	let rows: Components.RevoGrid['source']
	let columns = writable<RevoGridType.ColumnRegular[]>([])

	const select = writable<Record<string, boolean>>({})
	$: $table, select.set({})

	const updateSelect = (recordId: string, selected: boolean) => ($select[recordId] = selected)
	$: allSelected = records.length > 0 && Object.entries($select).filter(([, value]) => value).length === records.length
	const updateAllSelect = (s: boolean) => {
		const selected: Record<string, boolean> = {}
		for (const record of records) {
			selected[record.id.value] = s
		}

		select.set(selected)
	}

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
		rows = records.map((record) => record.valuesJSON)
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
						disabled: !records.length,
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
					editor: field.type,
					size: $view.getFieldWidth(field.id.value),
					pin: position ? pinnedPositionMap[position] : undefined,
					autoSize: true,
					cellTemplate: cellTemplateMap[field.type],
					columnTemplate: (h, column) => {
						const id = getFieldDomId(column.prop)
						return h(
							'div',
							{
								class: 'h-full inline-flex w-full justify-between items-center text-xs text-gray-700 font-medium',
							},
							[
								h(
									'span',
									{
										class: 'inline-flex items-center gap-1',
									},
									[
										h('i', { class: cx(getIconClass(column.field.type), 'text-gray-600 text-lg') }),
										h('span', {}, column.name),
									],
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
							'data-field-id': column.field.id.value,
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

	$: selectedRecords = Object.entries($select)
		.filter(([, value]) => value)
		.map(([key]) => key)
	$: selectedCount = Object.values($select).filter(Boolean).length
	$: hasRecord = !!records.length
	$: toastOpen = !!selectedCount

	const bulkDeleteRecordsMutation = trpc().record.bulkDelete.mutation({
		async onSuccess(data, variables, context) {
			await $data.refetch()

			select.set({})
		},
	})

	let confirmBulkDelete = false
	const confirm = () => {
		confirmBulkDelete = true
	}

	const bulkDeleteRecords = async () => {
		if (!selectedRecords.length) {
			return
		}

		$bulkDeleteRecordsMutation.mutate({
			tableId: $table.id.value,
			ids: selectedRecords as [string, ...string[]],
		})
		confirmBulkDelete = false
	}

	const deleteField = trpc().table.field.delete.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			$confirmDeleteField = false
		},
	})
</script>

<div class:h-[35px]={!hasRecord || $data.isLoading} class:h-full={hasRecord}>
	<RevoGrid
		bind:this={grid}
		source={rows}
		resize="true"
		columns={$columns}
		theme="compact"
		range
		rowClass="id"
		readonly
		{editors}
		on:aftercolumnresize={onAfterColumnResize}
	/>
</div>
{#if $data.isLoading}
	<LoadingTable />
{:else if !hasRecord}
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
		<P class="text-sm !text-gray-700">{@html $t('Selected N Records', { n: selectedCount })}</P>
		<Button color="alternative" class="inline-flex gap-2 items-center text-red-400" size="xs" on:click={confirm}>
			{#if $bulkDeleteRecordsMutation.isLoading}
				<Spinner class="mr-3" size="4" />
			{:else}
				<i class="ti ti-copy text-lg" />
			{/if}
			{$t('Delete Selected Record')}</Button
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

<Modal bind:open={confirmBulkDelete} size="xs">
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
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
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

<Portal target="body">
	<Modal bind:open={$confirmDeleteField} size="xs">
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
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
				{$t('Confirm Delete Field')}
			</h3>
			<Button
				color="red"
				class="mr-2 gap-2 whitespace-nowrap"
				disabled={$deleteField.isLoading}
				on:click={() => {
					if ($field) {
						$deleteField.mutate({ tableId: $table.id.value, id: $field.id.value })
					}
				}}
			>
				{#if $deleteField.isLoading}
					<Spinner size="xs" />
				{:else}
					<i class="ti ti-circle-check text-lg" />
				{/if}
				{$t('Confirm Yes', { ns: 'common' })}</Button
			>
			<Button color="alternative">{$t('Confirm No', { ns: 'common' })}</Button>
		</div>
	</Modal>
</Portal>

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

	:global(revogr-header .rgHeaderCell > .resizable-r) {
		width: 2px;
	}

	:global(revogr-focus) {
		border: 1px solid transparent;
	}
</style>
