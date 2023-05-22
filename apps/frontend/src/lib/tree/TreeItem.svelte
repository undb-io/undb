<script lang="ts">
	import type { TreeRecord } from './tree-view.type'
	import Sortable from 'sortablejs'

	export let records: TreeRecord[]

	let el: HTMLUListElement

	$: if (el) {
		Sortable.create(el, {
			group: 'nested',
			animation: 150,
			fallbackOnBody: true,
			swapThreshold: 0.65,
		})
	}
</script>

{#each records as record}
	<ul bind:this={el} class="ml-2">
		<div>
			{record.id}
		</div>
		<li>
			<svelte:self records={record.children} />
		</li>
	</ul>
{/each}
