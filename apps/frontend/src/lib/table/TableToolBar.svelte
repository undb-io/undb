<script lang="ts">
	import ViewToolbar from './ViewToolbar.svelte'
	import SearchTable from './SearchTable.svelte'
	import ToggleViewButton from './ToggleViewButton.svelte'
</script>

<div
	class="flex w-full flex-row items-center justify-between gap-y-4 border-b bg-white dark:border-b-gray-400 dark:bg-gray-700 px-5 py-2 overflow-x-auto overflow-y-hidden shrink-0"
>
	<div class="flex flex-nowrap gap-2 items-center">
		<ViewToolbar />
	</div>
	<div class="flex items-center ml-2 gap-3">
		<SearchTable />
		<ToggleViewButton />
	</div>
</div>
