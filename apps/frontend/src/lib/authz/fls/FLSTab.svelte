<script lang="ts">
	import cx from 'classnames'
	import { t } from '$lib/i18n'
	import type { IFLSAction } from '@undb/authz'
	import { Badge, TabItem } from 'flowbite-svelte'
	import { hasPermission } from '$lib/store/authz'

	export let action: IFLSAction

	$: flss = []
	$: count = flss.length
</script>

<TabItem open={action === 'view'} defaultClass={cx({ '!text-gray-500 dark:!text-gray-300': !flss.length })}>
	<span slot="title" class="flex items-center gap-2">
		{$t(action, { ns: 'authz' })}
		{#if count}
			<Badge class="rounded-full">
				{count}
			</Badge>
		{/if}
	</span>
	<div class="space-y-2">
		<!-- <RlsList {rlss} />
		{#if $hasPermission('rls:create')}
			<RlsCreate {action} {rlss} />
		{/if} -->
	</div>
</TabItem>
