<script lang="ts">
	import { Button, P, Tooltip } from 'flowbite-svelte'
	import FilterMenu from './FilterMenu.svelte'
	import SortMenu from './SortMenu.svelte'
	import ManageFieldsMenu from './ManageFieldsMenu.svelte'
	import TableNavigator from './TableNavigator.svelte'
	import ToggleDisplayType from './ToggleDisplayType.svelte'
	import { createFieldOpen, createRecordOpen, updateTableOpen } from '$lib/store/modal'
	import { getTable, getView } from '$lib/store/table'
	import ViewConfigMenu from '$lib/view/ViewConfigMenu.svelte'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'

	const table = getTable()
	const view = getView()

	const records = trpc().record.list.query(
		{ tableId: $table.id.value, viewId: $view.id.value },
		{ queryHash: ['records', $table.id.value, $view.id.value].toString() },
	)

	const refresh = async () => {
		await $records.refetch()
	}
</script>

<div
	class="flex w-full flex-row items-center justify-between gap-y-4 border-b bg-white px-5 py-2 overflow-x-auto overflow-y-hidden"
>
	<div class="flex items-center justify-center content-center gap-4">
		<TableNavigator />

		<Button
			on:click={() => createRecordOpen.set(true)}
			size="xs"
			class="h-full !rounded-md inline-flex items-center whitespace-nowrap bg-blue-500"
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

		{#if $records.data?.total}
			<P class="!text-gray-400 text-xs whitespace-nowrap">{$t('Total Records', { total: $records.data?.total })}</P>
		{/if}
	</div>

	<div class="flex items-center ml-2 gap-3">
		<button on:click={refresh}>
			<i class="ti ti-refresh text-gray-600" class:animate-spin={$records.isRefetching} />
		</button>
		<Tooltip placement="bottom">
			{$t('Force Refresh')}
		</Tooltip>
		<button on:click={() => ($updateTableOpen = true)}>
			<i class="ti ti-settings text-gray-600" />
		</button>
		<Tooltip placement="bottom">
			{$t('Edit Table')}
		</Tooltip>
		<ToggleDisplayType />
	</div>
</div>
