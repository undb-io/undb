<script lang="ts">
	import cx from 'classnames'
	import { t } from '$lib/i18n'
	import type { IFLSAction } from '@undb/authz'
	import { Badge, TabItem } from 'flowbite-svelte'
	import { hasPermission } from '$lib/store/authz'
	import FlsList from './FlsList.svelte'
	import { currentFLSS } from '$lib/store/table'
	import FlsCreate from './FLSCreate.svelte'

	export let action: IFLSAction

	$: flss = $currentFLSS.filter((fls) => fls.policy.action === action)
	$: count = flss.length
</script>

<TabItem open={action === 'update'} defaultClass={cx({ '!text-gray-500 dark:!text-gray-300': !flss.length })}>
	<span slot="title" class="flex items-center gap-2">
		{$t(action, { ns: 'authz' })}
		{#if count}
			<Badge class="rounded-full">
				{count}
			</Badge>
		{/if}
	</span>
	<div class="space-y-2">
		<FlsList {flss} />
		{#if $hasPermission('fls:create')}
			<FlsCreate {action} {flss} />
		{/if}
	</div>
</TabItem>
