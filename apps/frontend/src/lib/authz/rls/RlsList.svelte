<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import RlsItem from './RLSItem.svelte'

	const table = getTable()
	const view = getView()

	const getRLSSQuery = trpc().authz.rls.list.query({
		tableId: $table.id.value,
		viewId: $view.id.value,
	})

	$: rlss = $getRLSSQuery.data?.rlss ?? []
</script>

<ul class="space-y-2">
	{#each rlss as rls (rls.id)}
		<RlsItem {rls} />
	{/each}
</ul>
