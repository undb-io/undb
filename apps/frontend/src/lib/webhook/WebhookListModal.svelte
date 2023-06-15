<script lang="ts">
	import { Button, Drawer, Heading } from 'flowbite-svelte'
	import WebhookList from './WebhookList.svelte'
	import { t } from '$lib/i18n'
	import { sineIn } from 'svelte/easing'
	import { webhookDrawerMode, webhookListDrawer } from '$lib/store/drawer'
	import { getTable } from '$lib/store/table'
	import CreateWebhook from './CreateWebhook.svelte'
	import { page } from '$app/stores'

	const table = getTable()

	let transitionParams = {
		x: 320,
		duration: 100,
		easing: sineIn,
	}
</script>

<Drawer
	title="Webhooks"
	class="h-full !w-1/3 flex flex-col"
	transitionType="fly"
	{transitionParams}
	placement="right"
	bind:hidden={$webhookListDrawer.hidden}
>
	{#if $webhookDrawerMode === 'list'}
		<div class="flex items-center justify-between">
			<Heading tag="h5" class="whitespace-nowrap truncate">
				{$table.name.value} - Webhooks
			</Heading>

			<Button size="xs" class="whitespace-nowrap" on:click={() => ($webhookDrawerMode = 'create')}>
				{$t('Create New Webhook')}
			</Button>
		</div>
		<WebhookList />
	{:else if $webhookDrawerMode === 'create'}
		<div class="flex flex-col flex-1">
			<div class="flex items-center justify-between mb-4">
				<Heading tag="h5" class="whitespace-nowrap truncate">
					<button on:click={() => ($webhookDrawerMode = 'list')}>
						<i class="ti ti-corner-up-left" />
					</button>
					{$table.name.value} - Webhooks
				</Heading>
			</div>
			<CreateWebhook data={$page.data.createWebhook} />
		</div>
	{/if}
</Drawer>
