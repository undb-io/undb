<script lang="ts">
	import type { IQueryWebhook } from '@undb/integrations/dist'
	import { Badge, Card, P } from 'flowbite-svelte'

	export let webhook: IQueryWebhook
</script>

<Card class="w-full !max-w-none shadow-sm">
	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-3">
			<i class="ti ti-webhook" />
			<P class="font-semibold text-lg">{webhook.name}</P>
		</div>
		<div class="flex items-center gap-2">
			{#if webhook.enabled}
				<Badge color="green">Enabled</Badge>
			{:else}
				<Badge color="dark">Disabled</Badge>
			{/if}
			{#if webhook.target?.event}
				{webhook.target?.event}
			{/if}
		</div>
	</div>
</Card>
