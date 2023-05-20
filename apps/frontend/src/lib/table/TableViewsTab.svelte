<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { Tooltip } from 'flowbite-svelte'
	import TableViewTabItem from './TableViewTabItem.svelte'
	import { t } from '$lib/i18n'
	import { createViewModal } from '$lib/store/modal'
	import Sortable from 'sortablejs'
	import { onMount } from 'svelte'
	import type { SortableEvent } from 'sortablejs'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'

	const table = getTable()
	const currentView = getView()

	$: views = $table.orderedViews

	let el: HTMLUListElement

	const moveView = trpc().table.view.move.mutation({
		async onSuccess() {
			// await invalidate(`table:${$table.id.value}`)
		},
	})

	const onEnd = (event: SortableEvent) => {
		const { oldIndex, newIndex } = event
		if (oldIndex !== undefined && newIndex !== undefined) {
			const from = views[oldIndex]?.id.value
			const to = views[newIndex]?.id.value
			if (from && to && from !== to) {
				$moveView.mutate({
					tableId: $table.id.value,
					from,
					to,
				})
			}
		}
	}

	onMount(async () => {
		Sortable.create(el, {
			animation: 200,
			direction: 'horizontal',
			onEnd,
		})
	})
</script>

<section class="w-full mx-auto bg-gradient-to-r bg-white dark:bg-gray-900 border-b flex space-x-2 items-center">
	<ul bind:this={el} class="flex flex-wrap space-x-2">
		{#each views as view}
			<li>
				<TableViewTabItem view={view.id.value === $currentView.id.value ? $currentView : view} />
			</li>
		{/each}
	</ul>
	<button class="w-7 h-7 hover:bg-gray-100 transition" on:click={() => createViewModal.open()}>
		<i class="ti ti-plus text-gray-500" />
	</button>
	<Tooltip placement="bottom">{$t('Create New View')}</Tooltip>
</section>
