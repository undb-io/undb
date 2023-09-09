<script lang="ts">
	import { Button } from '$components/ui/button'
	import * as Table from '$lib/components/ui/table'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'
	import type { IQueryApiToken } from '@undb/openapi'
	import ApiTokenTableItem from './ApiTokenTableItem.svelte'

	export let apiTokens: IQueryApiToken[]

	const getApiTokens = trpc().openapi.apiToken.list.query(undefined, {
		enabled: false,
	})

	const createToken = trpc().openapi.apiToken.create.mutation({
		async onSuccess(data, variables, context) {
			await $getApiTokens.refetch()
		},
	})
</script>

<div class="flex justify-end mb-4">
	<Button class="w-40 gap-2" variant="secondary" on:click={() => $createToken.mutate()}>
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
