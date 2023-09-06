<script lang="ts">
	import { currentRLSS } from '$lib/store/table'
	import type { IRLSAction } from '@undb/authz'
	import RlsList from './RlsList.svelte'
	import RlsCreate from './RLSCreate.svelte'
	import { hasPermission } from '$lib/store/authz'

	export let action: IRLSAction

	$: rlss = $currentRLSS.filter((rls) => rls.policy.action === action)
	$: count = rlss.length
</script>

<div class="space-y-2">
	{#if !count}
		<div class="h-6"></div>
	{/if}
	<RlsList {rlss} />
	{#if $hasPermission('rls:create')}
		<RlsCreate {action} {rlss} />
	{/if}
</div>
