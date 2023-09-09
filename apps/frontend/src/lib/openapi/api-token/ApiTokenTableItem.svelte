<script lang="ts">
	import { Button } from '$components/ui/button'
	import * as Table from '$lib/components/ui/table'
	import { t } from '$lib/i18n'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import type { IQueryApiToken } from '@undb/openapi/dist'
	import { copyText } from 'svelte-copy'

	export let apiToken: IQueryApiToken

	let show = false
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
				<DropdownMenu.Item class="text-red-500">{$t('Delete', { ns: 'common' })}</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Table.Cell>
</Table.Row>
