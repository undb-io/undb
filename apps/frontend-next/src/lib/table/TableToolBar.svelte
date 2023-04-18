<script lang="ts">
	import { Button } from 'flowbite-svelte'
	import { IconRowInsertBottom } from '@tabler/icons-svelte'
	import ViewMenu from './ViewMenu.svelte'
	import FilterMenu from './FilterMenu.svelte'
	import SortMenu from './SortMenu.svelte'
	import ManageFieldsMenu from './ManageFieldsMenu.svelte'
	import TableNavigator from './TableNavigator.svelte'
	import ToggleDisplayType from './ToggleDisplayType.svelte'
</script>

<div class="h-[44px] flex items-center border-b px-5 rounded-none justify-between">
	<div class="flex items-center justify-center content-center gap-4">
		<TableNavigator />
		<Button size="xs" class="h-[26px] !rounded-sm inline-flex items-center">
			<IconRowInsertBottom size={16} class="mr-2" />
			Create New Record</Button
		>

		<ViewMenu />
		<FilterMenu />
		<SortMenu />
		<ManageFieldsMenu />
	</div>

	<div>
		<ToggleDisplayType />
	</div>
</div>
