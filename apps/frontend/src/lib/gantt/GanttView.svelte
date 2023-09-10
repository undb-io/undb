<script lang="ts">
	import { SvelteGantt, SvelteGanttDependencies, SvelteGanttExternal, SvelteGanttTable } from 'svelte-gantt'
	import type { SvelteGanttComponent, SvelteGanttOptions } from 'svelte-gantt/types/gantt'
	import { addDays, endOfWeek, format, startOfWeek, subDays } from 'date-fns'
	import { currentRecordId, getTable, listRecordFn, readonly, recordHash, recordsStore } from '$lib/store/table'
	import { RecordFactory, type DateRangeField } from '@undb/core'
	import type { RowModel } from 'svelte-gantt/types/core/row'
	import type { TaskModel } from 'svelte-gantt/types/core/task'
	import { onMount } from 'svelte'
	import { t } from '$lib/i18n'
	import EmptyTable from '../table/EmptyTable.svelte'
	import { trpc } from '$lib/trpc/client'

	const table = getTable()
	export let field: DateRangeField

	let currentStart = startOfWeek(new Date())
	let currentEnd = endOfWeek(new Date())

	const previous = () => {
		currentStart = subDays(currentStart, 7)
		currentEnd = subDays(currentEnd, 7)
	}

	const next = () => {
		currentStart = addDays(currentStart, 7)
		currentEnd = addDays(currentEnd, 7)
	}

	$: listRecords = $listRecordFn(
		[
			{
				conjunction: '$or',
				children: [
					{
						path: field.id.value,
						type: field.type,
						operator: '$between',
						value: [currentStart.toISOString(), currentEnd.toISOString()],
					},
					{
						path: field.id.value,
						type: field.type,
						operator: '$is_empty',
						value: null,
					},
				],
			},
		],
		{
			queryHash: $recordHash + '_gantt',
		},
	)
	$: recordsStore.setAllRecords(
		RecordFactory.fromQueryRecords($listRecords?.data?.records ?? [], $table.schema.toIdMap()) ?? [],
	)

	const updateRecord = trpc().record.update.mutation({
		async onSuccess(data, variables, context) {},
	})

	$: records = recordsStore.records
	$: rows = $records.map<RowModel>((r) => {
		const label = r.getDisplayFieldsValue($table)
		return {
			id: r.id.value,
			label,
			height: 52,
			classes: 'bg-gray-100 dark:!bg-gray-300 dark:text-white',
		}
	})

	$: tasks = $records
		.filter((r) => {
			const value = r.valuesJSON?.[field.id.value]
			const [from, to] = value
			return !!from && !!to
		})
		.map<TaskModel>((r) => {
			const value = r.valuesJSON?.[field.id.value]
			const [from, to] = value
			const fromTimeStamp = new Date(from).getTime()
			const toTimeStampe = new Date(to).getTime()
			const label = r.getDisplayFieldsValue($table)

			return {
				id: r.id.value as any as number,
				resourceId: r.id.value as any as number,
				label,
				from: fromTimeStamp,
				to: toTimeStampe,
				classes: 'bg-primary',
				enableDragging: !$readonly,
			}
		})

	$: options = {
		rows,
		tasks,
		dependencies: [],
		timeRanges: [],
		columnOffset: 15,
		magnetOffset: 15,
		rowHeight: 52,
		rowPadding: 6,
		headers: [{ unit: 'day', format: 'MMMM Do' }],
		fitWidth: true,
		minWidth: 800,
		from: currentStart.getTime(),
		to: currentEnd.getTime(),
		tableHeaders: [{ title: $t('Label', { ns: 'common' }), property: 'label', width: 140 }],
		tableWidth: 240,
		ganttTableModules: [SvelteGanttTable],
		ganttBodyModules: [SvelteGanttDependencies],
	} satisfies SvelteGanttOptions

	let ele: HTMLElement | undefined
	let gantt: SvelteGanttComponent
	onMount(() => {
		if (ele) {
			gantt = new SvelteGantt({ target: ele, props: options })
			// @ts-expect-error
			gantt.api.tasks.on.dblclicked((event, b) => {
				const [model] = event
				if (!model) return
				const recordId = model.id
				$currentRecordId = recordId
			})
			// @ts-expect-error
			gantt.api.tasks.on.changed((event) => {
				const [model] = event
				if (!model) return
				if (model.sourceRow.model.id !== model.targetRow.model.id) return

				const task = model.task
				const recordId = task.model.resourceId
				const newFrom = new Date(task.model.from)
				const newTo = new Date(task.model.to)

				$updateRecord.mutate({
					tableId: $table.id.value,
					id: recordId,
					values: {
						[field.id.value]: [newFrom.toISOString(), newTo.toISOString()],
					},
				})
			})

			ele.querySelectorAll('.sg-table-row').forEach((el) => {
				el.addEventListener('click', (e) => {
					const target = e.currentTarget as HTMLElement
					$currentRecordId = target.dataset.rowId
				})
			})
		}
	})

	$: if (gantt) gantt.$set(options)

	let externalEle: HTMLElement | undefined
	$: if (externalEle && gantt) {
		// @ts-ignore
		new SvelteGanttExternal(externalEle, {
			gantt,
			enabled: !$readonly,
			dragging: true,
			onsuccess: (row, date, gantt) => {
				const id = row.model.id as any
				const from = new Date(date)
				const to = addDays(from, 1)
				$updateRecord.mutate({
					tableId: $table.id.value,
					id,
					values: {
						[field.id.value]: [from.toISOString(), to.toISOString()],
					},
				})
				gantt.updateTask({
					id,
					label: row.model.label,
					from: date,
					to,
					resourceId: row.model.id as any as number,
				})
			},
			elementContent: () => {
				const element = document.createElement('div')
				element.className = 'absolute bg-gray-300 rounded-sm p-2 text-sm'
				element.innerHTML = $t('set date')
				return element
			},
		})
	}
</script>

<div class="w-full flex-1 h-full overflow-y-auto">
	<div class="flex justify-between p-2 text-gray-500">
		<div class="flex justify-center items-center gap-2 flex-1">
			<div class="flex items-center justify-center">
				<button
					on:click={previous}
					class="p-1 hover:bg-gray-100 w-6 h-6 inline-flex items-center justify-center transition"
				>
					<i class="ti ti-chevron-left" />
				</button>
				{format(currentStart, 'yyyy-MM-dd')}
				<span>-</span>
				{format(currentEnd, 'yyyy-MM-dd')}
				<button
					on:click={next}
					class="p-1 hover:bg-gray-100 w-6 h-6 inline-flex items-center justify-center transition"
				>
					<i class="ti ti-chevron-right" />
				</button>
			</div>
		</div>

		<div>
			<button bind:this={externalEle} class="rounded-sm bg-primary py-1 px-2 text-white text-xs"
				>{$t('drag to set date')}</button
			>
		</div>
	</div>
	<div class="flex flex-1 overflow-y-auto">
		<div class="border-t flex-grow overflow-auto" bind:this={ele} id="undb-gantt" />
	</div>
	{#if !$records.length}
		<div class="flex items-center justify-center h-full translate-y-[-10%]">
			<EmptyTable />
		</div>
	{/if}
</div>

<style>
	#undb-gantt :global(.sg-hover) {
		background-color: #00000008;
	}

	#undb-gantt :global(.sg-hover .sg-table-body-cell) {
		background-color: #00000008;
	}

	:global(.dark .sg-gantt .column-header-cell) {
		color: white;
	}

	:global(.dark .sg-gantt .column-header-cell:hover) {
		color: #374151;
		background-color: #f7f7f7;
	}

	:global(.dark .sg-gantt .sg-table-body-cell) {
		color: white;
		background-color: #374151;
		border: none;
	}

	:global(.dark .sg-gantt .sg-table-header-cell) {
		color: white;
		background-color: #374151;
	}
</style>
