<script lang="ts">
	import { currentRLSS } from '$lib/store/table'
	import type { IRLSAction } from '@undb/authz'
	import RlsList from './RlsList.svelte'
	import RlsCreate from './RLSCreate.svelte'
	import { hasPermission } from '$lib/store/authz'

	export let action: IRLSAction

	$: rlss = $currentRLSS.filter((rls) => rls.policy.action === action)
</script>

<div class="space-y-2">
	<RlsList {rlss} />
	{#if $hasPermission('rls:create')}
		<RlsCreate {action} {rlss} />
	{/if}
</div>
