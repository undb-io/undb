<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import TableViewTabItem from './TableViewTabItem.svelte'
	import { t } from '$lib/i18n'
	import Sortable from 'sortablejs'
	import { onMount, tick } from 'svelte'
	import type { SortableEvent } from 'sortablejs'
	import { trpc } from '$lib/trpc/client'
	import { goto, invalidate } from '$app/navigation'
	import ViewIcon from '$lib/view/ViewIcon.svelte'
	import type { IViewDisplayType } from '@undb/core'
	import { sidebarCollapsed } from '$lib/store/ui'
	import { hasPermission } from '$lib/store/authz'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$components/ui/button'

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

	let open = false
	const items = [
		{ value: 'grid', label: 'Grid' },
		{ value: 'kanban', label: 'Kanban' },
		{ value: 'gantt', label: 'Gantt' },
		{ value: 'calendar', label: 'Calendar' },
		{ value: 'tree', label: 'Tree' },
		{ value: 'gallery', label: 'Gallery' },
		{ value: 'dashboard', label: 'Dashboard' },
	] as const

	export let value: IViewDisplayType = 'grid'

	const createView = trpc().table.view.create.mutation({
		async onSuccess() {
			open = false
			await invalidate(`table:${$table.id.value}`)
			await tick()
			goto(`/t/${$table.id.value}/${$table.viewsOrder.last}`)
		},
	})
</script>

<section
	class="w-full mx-auto bg-gradient-to-r bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex space-x-2 items-center"
>
	{#if $sidebarCollapsed}
		<div class="ml-2">
			<Tooltip.Root>
				<Tooltip.Trigger>
					<button on:click={() => ($sidebarCollapsed = false)}>
						<i class="ti ti-layout-sidebar-left-expand text-lg text-gray-500 dark:hover:text-gray-100" />
					</button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>meta + b</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	{/if}
	<ul bind:this={el} class="flex flex-wrap space-x-2">
		{#each views as view}
			<li class="dark:text-gray-100">
				<TableViewTabItem view={view.id.value === $currentView.id.value ? $currentView : view} />
			</li>
		{/each}
	</ul>
	{#if $hasPermission('table:create_view')}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button size="icon" builders={[builder]} variant="ghost" class="w-7 h-7">
					<i class="ti ti-plus"></i>
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-48">
				<DropdownMenu.Group>
					{#each items as item}
						<DropdownMenu.Item
							on:click={() => {
								$createView.mutate({
									tableId: $table.id.value,
									view: {
										name: $t('view n', { n: views.length + 1 }),
										displayType: item.value,
									},
								})
							}}
						>
							<div role="button" class="flex items-center w-full h-full gap-2">
								<ViewIcon type={item.value} />
								{$t(item.value)}
							</div>
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/if}
</section>
