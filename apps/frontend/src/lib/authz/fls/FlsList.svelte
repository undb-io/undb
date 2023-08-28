<script lang="ts">
	import type { FLS } from '@undb/authz'
	import FlsItem from './FLSItem.svelte'

	export let flss: FLS[] = []
</script>

<ul class="space-y-2">
	{#each flss as fls (fls.id)}
		<FlsItem {fls} />
	{/each}
</ul>
