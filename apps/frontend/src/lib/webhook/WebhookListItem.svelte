<script lang="ts">
	import { t } from '$lib/i18n'
	import { selectedWebhook } from '$lib/store/drawer'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { IQueryWebhook } from '@undb/integrations'
	import { Badge, P } from 'flowbite-svelte'
	import * as Card from '$lib/components/ui/card'

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
					<P class="font-semibold text-lg">{webhook.name}</P>
				</div>
				<div class="flex items-center gap-2">
					{#if webhook.enabled}
						<Badge color="green">{$t('Enabled', { ns: 'webhook' })}</Badge>
					{:else}
						<Badge color="dark">{$t('Disabled', { ns: 'webhook' })}</Badge>
					{/if}
					{#if webhook.target?.event}
						{$t(webhook.target?.event, { ns: 'event' })}
					{/if}
				</div>
			</div>

			<div>
				<button
					class="group-hover:opacity-100 opacity-0"
					on:click={() =>
						$deleteWebhook.mutate({
							webhookId: webhook.id,
						})}
				>
					<i class="ti ti-trash" />
				</button>
			</div>
		</div>
	</Card.Header>
</Card.Root>
