<script lang="ts">
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'

	const table = getTable()

	const getWebhooks = trpc().webhook.list.query({
		tableId: $table.id.value,
	})

	$: webhooks = $getWebhooks.data?.webhooks ?? []
</script>

<div>
	{#each webhooks as webhook}
		{webhook.id}
	{/each}
</div>
