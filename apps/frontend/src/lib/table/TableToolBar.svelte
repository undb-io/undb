<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip'
	import ToggleDisplayType from './ToggleDisplayType.svelte'
	import { t } from '$lib/i18n'
	import ViewToolbar from './ViewToolbar.svelte'
	import { updateTableModal } from '$lib/store/modal'
	import { getTable } from '$lib/store/table'
	import SearchTable from './SearchTable.svelte'
	import FormsButton from './FormsButton.svelte'
	import RecordTrashButton from './RecordTrashButton.svelte'
	import TableMenu from './TableMenu.svelte'
	import { hasPermission } from '$lib/store/authz'
	import { Button } from '$components/ui/button'

	const table = getTable()
</script>

<div
	class="flex w-full flex-row items-center justify-between gap-y-4 border-b bg-white dark:border-b-gray-400 dark:bg-gray-700 px-5 py-2 overflow-x-auto overflow-y-hidden shrink-0"
>
	<div class="flex flex-nowrap gap-1">
		<ViewToolbar />
	</div>
	<div class="flex items-center ml-2 gap-3">
		<SearchTable />
		<Button size="sm" variant="outline" class="flex items-center text-xs gap-2" href={`/t/${$table.id.value}/openapi`}>
			<i class="ti ti-code" />
			<span class="whitespace-nowrap">{$t('API Preview')}</span>
		</Button>
		{#if $hasPermission('table:update')}
			<Tooltip.Root openDelay={10}>
				<Tooltip.Trigger>
					<button on:click={() => updateTableModal.open()}>
						<i class="ti ti-settings text-gray-600 dark:text-gray-200" />
					</button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					{$t('Edit Table')}
				</Tooltip.Content>
			</Tooltip.Root>
		{/if}
		<ToggleDisplayType />
		{#if $hasPermission('table:list_form')}
			<FormsButton />
		{/if}

		{#if $hasPermission('record:list_trash')}
			<RecordTrashButton />
		{/if}

		<TableMenu />
	</div>
</div>
