<script lang="ts">
	import { Button, Tooltip } from 'flowbite-svelte'
	import ToggleDisplayType from './ToggleDisplayType.svelte'
	import { t } from '$lib/i18n'
	import ViewToolbar from './ViewToolbar.svelte'
	import TableNavigator from './TableNavigator.svelte'
	import { updateTableModal } from '$lib/store/modal'
	import { getTable } from '$lib/store/table'
	import SearchTable from './SearchTable.svelte'
	import FormsButton from './FormsButton.svelte'

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
		<Button
			size="xs"
			outline
			class="flex items-center gap-2 dark:text-gray-200 dark:bg-primary-600 dark:border-primary-600 dark:hover:bg-primary-700 dark:hover:border-primary-700"
			href={`/t/${$table.id.value}/openapi`}
		>
			<i class="ti ti-code" />
			<span class="whitespace-nowrap">{$t('API Preview')}</span>
		</Button>
		<button on:click={() => updateTableModal.open()}>
			<i class="ti ti-settings text-gray-600 dark:text-gray-200" />
		</button>
		<Tooltip class="z-50" placement="bottom">
			{$t('Edit Table')}
		</Tooltip>
		<ToggleDisplayType />
		<FormsButton />
	</div>
</div>
