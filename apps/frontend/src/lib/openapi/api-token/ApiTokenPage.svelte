<script lang="ts">
	import { trpc } from '$lib/trpc/client'
	import ApiTokenTable from './ApiTokenTable.svelte'
	import EmptyApiToken from './EmptyApiToken.svelte'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { confirmCreateApiToken } from '$lib/store/modal'
	import { t } from '$lib/i18n'

	const getApiTokens = trpc().openapi.apiToken.list.query()

	const createToken = trpc().openapi.apiToken.create.mutation({
		async onSuccess(data, variables, context) {
			await $getApiTokens.refetch()
		},
	})

	$: apiTokens = $getApiTokens.data?.apiTokens ?? []
</script>

{#if $getApiTokens.isLoading}
	<i class="ti ti-rotate text-2xl font-bold animate-spin"></i>
{:else if !apiTokens.length}
	<EmptyApiToken />
{:else}
	<ApiTokenTable {apiTokens} />
{/if}

<AlertDialog.Root bind:open={$confirmCreateApiToken}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{$t('Confirm Create', { ns: 'openapi' })}
			</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel on:click={() => confirmCreateApiToken.set(false)}>
				{$t('Cancel', { ns: 'common' })}
			</AlertDialog.Cancel>
			<AlertDialog.Action on:click={() => $createToken.mutate()}>
				{$t('Confirm', { ns: 'common' })}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
