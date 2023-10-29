<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { t } from '$lib/i18n'
	import Sortable from 'sortablejs'
	import { tick } from 'svelte'
	import type { SortableEvent } from 'sortablejs'
	import { trpc } from '$lib/trpc/client'
	import { goto, invalidate } from '$app/navigation'
	import ViewIcon from '$lib/view/ViewIcon.svelte'
	import type { IViewDisplayType } from '@undb/core'
	import { hasPermission } from '$lib/store/authz'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$components/ui/button'
	import ViewListItem from './ViewListItem.svelte'
	import { toast } from 'svelte-sonner'
	import { viewsSideBarOpen } from '$lib/store/modal'

	const table = getTable()
	const currentView = getView()

	$: views = $table.orderedViews

	let el: HTMLUListElement

	const moveView = trpc().table.view.move.mutation({})

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

	$: if (el) {
		Sortable.create(el, {
			animation: 200,
			direction: 'vertical',
			onEnd,
			handle: '.handle',
		})
	}

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
			toast.success($t('TABLE.VIEW_CREATED', { ns: 'success' }))
			await invalidate(`table:${$table.id.value}`)
			await tick()
			goto(`/t/${$table.id.value}/${$table.viewsOrder.last}`)
			viewsSideBarOpen.set(false)
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})
</script>

<section
	class="w-full h-full bg-gradient-to-r bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col border-l border-gra300 shadow-lg"
>
	<ul bind:this={el} class="flex-1 p-2 space-y-1">
		{#each views as view}
			<ViewListItem view={view.id.value === $currentView.id.value ? $currentView : view} />
		{/each}
	</ul>
	<div class="p-4 w-full">
		{#if $hasPermission('table:create_view')}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button size="sm" builders={[builder]} class="w-full gap-2 whitespace-nowrap ">
						<i class="ti ti-plus"></i>
						<span>
							{$t('Create New View')}
						</span>
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
	</div>
</section>
