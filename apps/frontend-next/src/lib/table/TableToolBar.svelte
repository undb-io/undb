<script lang="ts">
	import { Button, Tooltip } from 'flowbite-svelte'
	import { IconColumnInsertRight, IconRowInsertBottom } from '@tabler/icons-svelte'
	import ViewMenu from './ViewMenu.svelte'
	import FilterMenu from './FilterMenu.svelte'
	import SortMenu from './SortMenu.svelte'
	import ManageFieldsMenu from './ManageFieldsMenu.svelte'
	import TableNavigator from './TableNavigator.svelte'
	import ToggleDisplayType from './ToggleDisplayType.svelte'
	import { createFieldOpen, createRecordOpen } from '$lib/store/modal'
</script>

<div class="flex w-full flex-row items-center justify-between gap-y-4 border-b bg-white px-5 py-4 ">
	<div class="flex items-center justify-center content-center gap-4">
		<TableNavigator />

		<Button on:click={() => createRecordOpen.set(true)} size="xs" class="h-full !rounded-md inline-flex items-center">
			<IconRowInsertBottom size={16} class="mr-2" />
			Create New Record</Button
		>

		<ViewMenu />
		<FilterMenu />
		<SortMenu />
		<ManageFieldsMenu />

		<Button
			on:click={() => createFieldOpen.set(true)}
			size="xs"
			class="h-full w-8 px-0 !rounded-md inline-flex items-center"
		>
			<IconColumnInsertRight size={14} /></Button
		>
		<Tooltip placement="bottom">Insert Field</Tooltip>
	</div>

	<div>
		<ToggleDisplayType />
	</div>
</div>
