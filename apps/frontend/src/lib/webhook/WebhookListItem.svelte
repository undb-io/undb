<script lang="ts">
	import { t } from '$lib/i18n'
	import { selectedWebhook } from '$lib/store/drawer'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { IQueryWebhook } from '@undb/integrations'
	import * as Card from '$lib/components/ui/card'
	import { Button } from '$components/ui/button'
	import { Badge } from '$components/ui/badge'

	export let webhook: IQueryWebhook
	const table = getTable()

	const getWebhooks = trpc().webhook.list.query(
		{
			tableId: $table.id.value,
		},
		{
			queryHash: $table.id.value,
			enabled: false,
		},
	)

	const deleteWebhook = trpc().webhook.delete.mutation({
		onSuccess(data, variables, context) {
			$getWebhooks.refetch()
		},
	})
</script>

<Card.Root class="w-full shadow-sm cursor-pointer hover:shadow-md transition-all">
	<Card.Header>
		<div
			on:click={() => {
				$selectedWebhook = webhook
			}}
			class="flex items-center justify-between group"
		>
			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-3">
					<i class="ti ti-webhook" />
					<p class="font-semibold text-lg">{webhook.name}</p>
				</div>
				<div class="flex items-center gap-2">
					{#if webhook.enabled}
						<Badge class="bg-green-500">{$t('Enabled', { ns: 'webhook' })}</Badge>
					{:else}
						<Badge class="bg-slate-500">{$t('Disabled', { ns: 'webhook' })}</Badge>
					{/if}
					{#if webhook.target?.event}
						<span class="text-sm">
							{$t(webhook.target?.event, { ns: 'event' })}
						</span>
					{/if}
				</div>
			</div>

			<div>
				<Button
					class="group-hover:opacity-100 opacity-0 transition"
					size="icon"
					variant="destructive"
					on:click={() =>
						$deleteWebhook.mutate({
							webhookId: webhook.id,
						})}
				>
					<i class="ti ti-trash" />
				</Button>
			</div>
		</div>
	</Card.Header>
</Card.Root>
