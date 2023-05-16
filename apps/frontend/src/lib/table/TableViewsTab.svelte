<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { Tooltip } from 'flowbite-svelte'
	import TableViewTabItem from './TableViewTabItem.svelte'
	import { t } from '$lib/i18n'
	import { createViewModal } from '$lib/store/modal'

	const table = getTable()
	const currentView = getView()

	$: views = $table.views.views ?? []
</script>

<section class="w-full mx-auto bg-gradient-to-r bg-white dark:bg-gray-900 border-b flex space-x-2 items-center">
	<ul class="flex flex-wrap space-x-2">
		{#each views as view}
			<TableViewTabItem view={view.id.value === $currentView.id.value ? $currentView : view} />
		{/each}
	</ul>
	<button class="w-7 h-7 hover:bg-gray-100 transition" on:click={() => createViewModal.open()}>
		<i class="ti ti-plus text-gray-500" />
	</button>
	<Tooltip placement="bottom">{$t('Create New View')}</Tooltip>
</section>
