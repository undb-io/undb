<script lang="ts">
	import { Button } from '$components/ui/button'
	import * as Table from '$lib/components/ui/table'
	import { t } from '$lib/i18n'
	import type { IQueryApiToken } from '@undb/openapi'
	import ApiTokenTableItem from './ApiTokenTableItem.svelte'
	import { confirmCreateApiToken } from '$lib/store/modal'

	export let apiTokens: IQueryApiToken[]
</script>

<div class="flex justify-end mb-4">
	<Button class="w-40 gap-2" variant="secondary" on:click={() => ($confirmCreateApiToken = true)}>
		<i class="ti ti-plus"></i>
		{$t('Create New Token', { ns: 'openapi' })}
	</Button>
</div>
<Table.Root>
	<Table.Caption>{$t('your tokens', { ns: 'openapi' })}</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>Token</Table.Head>
			<Table.Head class="text-right">{$t('Actions', { ns: 'common' })}</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each apiTokens as apiToken}
			<ApiTokenTableItem {apiToken} />
		{/each}
	</Table.Body>
</Table.Root>
