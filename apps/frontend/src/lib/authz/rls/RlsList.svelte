<script lang="ts">
	import type { RLS } from '@undb/authz'
	import RlsItem from './RLSItem.svelte'

	export let rlss: RLS[] = []
</script>

<ul class="space-y-2">
	{#each rlss as rls (rls.id)}
		<RlsItem {rls} />
	{/each}
</ul>
