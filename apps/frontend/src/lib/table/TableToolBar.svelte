<script lang="ts">
	import { Button, P, Tooltip } from 'flowbite-svelte'
	import FilterMenu from './FilterMenu.svelte'
	import SortMenu from './SortMenu.svelte'
	import ManageFieldsMenu from './ManageFieldsMenu.svelte'
	import TableNavigator from './TableNavigator.svelte'
	import ToggleDisplayType from './ToggleDisplayType.svelte'
	import { createFieldOpen, createRecordOpen, updateTableOpen } from '$lib/store/modal'
	import { records } from '$lib/store/table'
	import ViewConfigMenu from '$lib/view/ViewConfigMenu.svelte'
	import { t } from '$lib/i18n'
</script>

<div class="flex w-full flex-row items-center justify-between gap-y-4 border-b bg-white px-5 py-2 overflow-x-auto">
	<div class="flex items-center justify-center content-center gap-4">
		<TableNavigator />

		<Button
			on:click={() => createRecordOpen.set(true)}
			size="xs"
			class="h-full !rounded-md inline-flex items-center whitespace-nowrap"
		>
			<i class="ti ti-row-insert-bottom text-sm mr-2" />
			{$t('Create New Record')}</Button
		>

		<ViewConfigMenu />
		<FilterMenu />
		<SortMenu />
		<ManageFieldsMenu />

		<Button
			on:click={() => createFieldOpen.set(true)}
			size="xs"
			outline
			class="h-full w-8 px-0 !rounded-md inline-flex items-center whitespace-nowrap transition"
		>
			<i class="ti ti-column-insert-right text-sm" />
		</Button>
		<Tooltip placement="bottom">{$t('Insert Field Right')}</Tooltip>

		{#if $records?.length}
			<P class="!text-gray-400 text-xs whitespace-nowrap">{$t('Total Records', { total: $records.length })}</P>
		{/if}
	</div>

	<div class="flex items-center ml-2 gap-3">
		<button on:click={() => ($updateTableOpen = true)}>
			<i class="ti ti-settings text-gray-600" />
		</button>
		<ToggleDisplayType />
	</div>
</div>
