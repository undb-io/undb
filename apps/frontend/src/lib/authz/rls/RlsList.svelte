<script lang="ts">
	import { currentRLSS, getTable } from '$lib/store/table'
	import RlsItem from './RLSItem.svelte'

	const table = getTable()
</script>

<ul class="space-y-2 p-2 bg-gray-50 border border-gray-100 rounded-md">
	{#each $currentRLSS as rls (rls.id)}
		<RlsItem {rls} />
	{/each}
</ul>
