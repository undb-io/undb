<script lang="ts">
	import type { IFLSAction } from '@undb/authz'
	import * as Tabs from '$lib/components/ui/tabs'
	import { hasPermission } from '$lib/store/authz'
	import FlsList from './FlsList.svelte'
	import { currentFLSS } from '$lib/store/table'
	import FlsCreate from './FLSCreate.svelte'

	export let action: IFLSAction

	$: flss = $currentFLSS.filter((fls) => fls.policy.action === action)
</script>

<Tabs.Content value={action}>
	<div class="space-y-2">
		<FlsList {flss} />
		{#if $hasPermission('fls:create')}
			<FlsCreate {action} {flss} />
		{/if}
	</div>
</Tabs.Content>
