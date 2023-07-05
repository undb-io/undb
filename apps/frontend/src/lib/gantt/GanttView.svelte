<script lang="ts">
	import { getTable, listRecordFn } from '$lib/store/table'
	import { RecordFactory, type DateRangeField } from '@undb/core'
	import { endOfMonth, startOfMonth } from 'date-fns'
	import Gantt from 'frappe-gantt'

	const table = getTable()

	export let field: DateRangeField
	export let ele: HTMLElement | undefined

	let start = startOfMonth(new Date())
	let end = endOfMonth(new Date())

	const listRecords = $listRecordFn([
		{
			path: field.id.value,
			type: field.type,
			operator: '$between',
			value: [start.toISOString(), end.toISOString()],
		},
	])

	$: records = RecordFactory.fromQueryRecords($listRecords?.data?.records ?? [], $table.schema.toIdMap()) ?? []

	$: tasks = records.map((r) => ({
		id: r.id.value,
		name: r.getDisplayFieldsValue($table),
		start: r.valuesJSON[field.id.value]?.[0],
		end: r.valuesJSON[field.id.value]?.[1],
		progress: 100,
		dependencies: '',
	}))

	let gantt: Gantt | undefined
	$: if (ele && tasks.length) {
		gantt = new Gantt(ele, tasks, {
			view_mode: 'Day',
		})
	}
</script>

{#if $listRecords.isLoading}
	<span>loading</span>
{:else}
	<div class="h-full" bind:this={ele} />
{/if}
