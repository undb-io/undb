<script lang="ts">
	import { SvelteGantt, SvelteGanttDependencies, SvelteGanttTable } from 'svelte-gantt'
	import { onMount } from 'svelte'
	import type { SvelteGanttComponent, SvelteGanttOptions } from 'svelte-gantt/types/gantt'
	import { endOfDay, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek } from 'date-fns'

	let currentStart = startOfWeek(new Date())
	let currentEnd = endOfWeek(new Date())

	export const data = {
		rows: [
			{
				id: 1,
				label: 'Accounting',
				height: 52,
			},
			{
				id: 2,
				label: 'Business Development',
				height: 52,
			},
			{
				id: 3,
				label: 'Ida Flewan',
				height: 52,
			},
			{
				id: 4,
				label: 'Lauréna Shrigley',
				height: 52,
			},
			{
				id: 5,
				label: 'Ange Kembry',
				height: 52,
			},
		],
		tasks: [
			{
				id: 3,
				resourceId: 1,
				label: 'PET-CT',
				from: startOfDay(new Date()).getTime(),
				to: endOfDay(new Date()).getTime(),
				classes: 'orange',
			},
		],
		dependencies: [],
	}

	let options: SvelteGanttOptions = {
		rows: data.rows,
		tasks: data.tasks,
		dependencies: data.dependencies,
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
		tableHeaders: [{ title: 'Label', property: 'label', width: 140, type: 'tree' }],
		tableWidth: 240,
		ganttTableModules: [SvelteGanttTable],
		ganttBodyModules: [SvelteGanttDependencies],
	}

	let ele: HTMLElement | undefined
	let gantt: SvelteGanttComponent
	onMount(() => {
		if (ele) {
			gantt = new SvelteGantt({ target: ele, props: options })
		}
	})
</script>

<div class="w-full">
	<div bind:this={ele} id="undb-gantt" />
</div>

<style>
	#undb-gantt {
		flex-grow: 1;
		overflow: auto;
	}

	#undb-gantt :global(.sg-hover) {
		background-color: #00000008;
	}

	#undb-gantt :global(.sg-hover .sg-table-body-cell) {
		background-color: #00000008;
	}
</style>
