<script lang="ts">
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { webhookDrawerMode } from '$lib/store/drawer'
	import { Button } from '$components/ui/button'
</script>

<div class="flex flex-col items-center justify-center gap-4">
	{#if $hasPermission('webhook:create')}
		<p class="font-bold text-white">{$t('Create New Webhook', { ns: 'webhook' })}</p>

		<Button on:click={() => ($webhookDrawerMode = 'create')} class="w-[250px]">
			{$t('Create New Webhook', { ns: 'webhook' })}
		</Button>
	{/if}
</div>
