<script lang="ts">
	import WebhookList from './WebhookList.svelte'
	import { t } from '$lib/i18n'
	import { selectedWebhook, webhookDrawerMode } from '$lib/store/drawer'
	import { getTable } from '$lib/store/table'
	import CreateWebhook from './CreateWebhook.svelte'
	import { page } from '$app/stores'
	import UpdateWebhook from './UpdateWebhook.svelte'
	import { hasPermission } from '$lib/store/authz'
	import * as Sheet from '$lib/components/ui/sheet'
	import { webhookModal } from '$lib/store/modal'
	import { Button } from '$components/ui/button'

	const table = getTable()

	$: if ($selectedWebhook) {
		$webhookDrawerMode = 'update'
	} else {
		$webhookDrawerMode = 'list'
	}
</script>

<Sheet.Root bind:open={$webhookModal.open}>
	<Sheet.Content class="!w-1/3 !max-w-none">
		<Sheet.Header>
			<Sheet.Title>{$t('Webhook', { ns: 'webhook' })}</Sheet.Title>
		</Sheet.Header>

		<section class="h-full">
			{#if $webhookDrawerMode === 'list'}
				<div class="flex items-center justify-between">
					<h3 class="whitespace-nowrap truncate dark:text-white">
						{$table.name.value} - Webhooks
					</h3>

					{#if $hasPermission('webhook:create')}
						<Button size="sm" class="whitespace-nowrap" on:click={() => ($webhookDrawerMode = 'create')}>
							{$t('Create New Webhook', { ns: 'webhook' })}
						</Button>
					{/if}
				</div>
				<WebhookList />
			{:else if $webhookDrawerMode === 'create' && $hasPermission('webhook:create')}
				<div class="flex flex-col flex-1">
					<div class="flex items-center justify-between mb-4">
						<h3 class="whitespace-nowrap truncate dark:text-white">
							<button on:click={() => ($webhookDrawerMode = 'list')}>
								<i class="ti ti-corner-up-left" />
							</button>
							{$table.name.value} - Webhooks
						</h3>
					</div>
					<CreateWebhook data={$page.data.createWebhook} />
				</div>
			{:else if $webhookDrawerMode === 'update' && $selectedWebhook && $hasPermission('webhook:update')}
				<div class="flex flex-col flex-1">
					<div class="flex items-center justify-between mb-4">
						<h3 class="whitespace-nowrap truncate dark:text-white">
							<button on:click={() => ($selectedWebhook = undefined)}>
								<i class="ti ti-corner-up-left" />
							</button>
							{$table.name.value} - Webhooks
						</h3>
					</div>
					<UpdateWebhook data={$page.data.updateWebhook} webhook={$selectedWebhook} />
				</div>
			{/if}
		</section>
	</Sheet.Content>
</Sheet.Root>
