<script lang="ts">
	import type { IRLSAction } from '@undb/authz/dist'
	import { currentRLSS } from '$lib/store/table'
	import { Badge } from '$components/ui/badge'

	export let action: IRLSAction
	$: rlss = $currentRLSS.filter((rls) => rls.policy.action === action)
	$: count = rlss.length
</script>

<div class="flex gap-1">
	{action}
	{#if count}
		<Badge class="rounded-full">
			{count}
		</Badge>
	{/if}
</div>
