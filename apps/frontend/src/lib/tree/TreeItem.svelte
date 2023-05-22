<script lang="ts">
	import { getTable } from '$lib/store/table'
	import type { TreeRecord } from './tree-view.type'
	import Sortable from 'sortablejs'

	const table = getTable()
	export let records: TreeRecord[]

	let el: HTMLDivElement

	$: if (el) {
		Sortable.create(el, {
			group: 'nested',
			animation: 150,
			fallbackOnBody: true,
			swapThreshold: 0.65,
			onEnd: console.log,
		})
	}
</script>

{#each records as record}
	{@const title = record.record.getDisplayFieldsValue($table)}
	<div bind:this={el} class="ml-8 -mt-[1px]" data-record-id={record.id}>
		<div class="py-2 px-3 bg-white border border-slate-200 border-collapse">
			{title}
		</div>

		{#if record.children.length}
			<svelte:self records={record.children} />
		{/if}
	</div>
{/each}
