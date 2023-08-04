<script lang="ts">
	import { currentRLSS } from '$lib/store/table'
	import RlsItem from './RLSItem.svelte'
</script>

<ul class="space-y-2">
	{#each $currentRLSS as rls (rls.id)}
		<RlsItem {rls} />
	{/each}
</ul>
