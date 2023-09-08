<script lang="ts">
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import EmptyWebhook from './EmptyWebhook.svelte'
	import WebhookListItem from './WebhookListItem.svelte'

	const table = getTable()

	const getWebhooks = trpc().webhook.list.query(
		{
			tableId: $table.id.value,
		},
		{
			queryHash: $table.id.value,
		},
	)

	$: webhooks = $getWebhooks.data?.webhooks ?? []
</script>

<div class="h-full">
	{#if $getWebhooks.isLoading}
		<div class="h-full flex items-center justify-center">
			<i class="ti ti-rotate animate-spin"></i>
		</div>
	{:else if !webhooks.length}
		<div class="h-full flex justify-center">
			<EmptyWebhook />
		</div>
	{:else}
		<div class="pt-5 space-y-3">
			{#each webhooks as webhook}
				<WebhookListItem {webhook} />
			{/each}
		</div>
	{/if}
</div>
