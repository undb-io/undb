<script lang="ts">
	import cx from 'classnames'
	import { t } from '$lib/i18n'
	import { currentRLSS } from '$lib/store/table'
	import type { IRLSAction } from '@undb/authz'
	import { Badge, TabItem } from 'flowbite-svelte'
	import RlsList from './RlsList.svelte'
	import RlsCreate from './RLSCreate.svelte'

	export let action: IRLSAction

	$: rlss = $currentRLSS.filter((rls) => rls.policy.action === action)
	$: count = rlss.length
</script>

<TabItem open={action === 'list'} defaultClass={cx({ '!text-gray-300': !rlss.length })}>
	<span slot="title" class="flex items-center gap-2">
		{$t(action, { ns: 'authz' })}
		{#if count}
			<Badge class="rounded-full">
				{count}
			</Badge>
		{/if}
	</span>
	<div class="space-y-2">
		<RlsList {rlss} />
		<RlsCreate {action} {rlss} />
	</div>
</TabItem>
