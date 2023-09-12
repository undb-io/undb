<script lang="ts">
	import { Button } from '$components/ui/button'
	import * as Table from '$lib/components/ui/table'
	import { t } from '$lib/i18n'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import type { IQueryApiToken } from '@undb/openapi'
	import { copyText } from 'svelte-copy'
	import { trpc } from '$lib/trpc/client'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'

	export let apiToken: IQueryApiToken

	let show = false

	const getApiTokens = trpc().openapi.apiToken.list.query()

	let confirmDelete = false

	const deleteApiToken = trpc().openapi.apiToken.delete.mutation({
		async onSuccess(data, variables, context) {
			await $getApiTokens.refetch()
		},
	})
</script>

<Table.Row>
	<Table.Cell class="text-gray-700">
		{#if show}
			{apiToken.token}
		{:else}
			{'*'.repeat(40)}
		{/if}
	</Table.Cell>
	<Table.Cell class="flex justify-end text-right">
		<Button variant="ghost" size="sm" on:click={() => (show = !show)}>
			{#if show}
				<i class="ti ti-eye-closed"></i>
			{:else}
				<i class="ti ti-eye"></i>
			{/if}
		</Button>
		<Button variant="ghost" size="sm" on:click={() => copyText(apiToken.token)}>
			<i class="ti ti-copy"></i>
		</Button>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button variant="ghost" size="sm">
					<i class="ti ti-dots"></i>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Item
					class="text-red-500"
					on:click={() => {
						confirmDelete = true
					}}
				>
					{$t('Delete', { ns: 'common' })}
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Table.Cell>
</Table.Row>

<AlertDialog.Root bind:open={confirmDelete}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{$t('Confirm Delete', { ns: 'openapi' })}</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel
				on:click={() => {
					confirmDelete = false
				}}
			>
				{$t('Cancel', { ns: 'common' })}
			</AlertDialog.Cancel>
			<AlertDialog.Action
				variant="destructive"
				on:click={() => {
					$deleteApiToken.mutate({
						apiTokenId: apiToken.id,
					})
				}}
			>
				{$t('Confirm', { ns: 'common' })}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
