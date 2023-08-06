<script lang="ts">
	import cx from 'classnames'
	import { t } from '$lib/i18n'
	import { currentRLSS } from '$lib/store/table'
	import type { IRLSAction } from '@undb/authz/dist'
	import { TabItem } from 'flowbite-svelte'
	import RlsList from './RlsList.svelte'
	import RlsCreate from './RLSCreate.svelte'

	export let action: IRLSAction

	$: rlss = $currentRLSS.filter((rls) => rls.policy.action === action)
</script>

<TabItem
	open={action === 'list'}
	title={$t(action, { ns: 'authz' })}
	defaultClass={cx({ '!text-gray-400': !rlss.length })}
>
	<div class="space-y-2">
		<RlsList {rlss} />
		<RlsCreate {action} {rlss} />
	</div>
</TabItem>
