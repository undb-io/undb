<script lang="ts">
	import type { IRLSAction } from '@undb/authz'
	import { currentRLSS } from '$lib/store/table'
	import { Badge } from '$components/ui/badge'
	import { t } from '$lib/i18n'

	export let action: IRLSAction
	$: rlss = $currentRLSS.filter((rls) => rls.policy.action === action)
	$: count = rlss.length
</script>

<div class="flex gap-1">
	{$t(action, { ns: 'authz' })}
	{#if count}
		<Badge class="rounded-full">
			{count}
		</Badge>
	{/if}
</div>
