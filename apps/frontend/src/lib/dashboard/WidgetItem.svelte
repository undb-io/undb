<script lang="ts">
	import { cn } from '$lib/utils'
	import { invalidate } from '$app/navigation'
	import { currentVisualizationId, getTable, getView, readonly } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import Visualization from '$lib/visualization/Visualization.svelte'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import type { WidgetDataItem } from './widget-item.type'
	import { t } from '$lib/i18n'
	import { COLS, widgetItems } from '$lib/store/widget'
	import type { IRelayoutWidgetSchema } from '@undb/core'
	import { visualizationModal } from '$lib/store/modal'

	const table = getTable()
	const view = getView()

	export let dataItem: WidgetDataItem
	export let movePointerDown: ((e: Event) => void) | undefined = undefined
	export let resizePointerDown: ((e: Event) => void) | undefined = undefined

	export let updating = false

	let ref: HTMLInputElement

	$: if (updating) {
		ref?.focus()
	}

	const updateVisualization = trpc().table.visualization.update.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const relayoutWidgets = trpc().table.view.dashboard.relayoutWidgets.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const deleteWidget = trpc().table.view.dashboard.deleteWidget.mutation({
		async onSuccess(data, variables, context) {
			if (!dataItem.widget) return
			const items = widgetItems.remove(dataItem.widget.id.value)
			const widgets: IRelayoutWidgetSchema[] = items.map((item) => {
				const { x, y, h, w } = item[COLS]
				const layout = { x, y, h, w }
				return { id: item.id, layout }
			})
			$relayoutWidgets.mutate({
				tableId: $table.id.value,
				viewId: $view.id.value,
				widgets,
			})
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const blur = (event: Event) => {
		updating = false
		const target = event.target as HTMLInputElement
		const value = target.value
		if (dataItem.widget?.visualization && value !== dataItem.widget?.visualization?.name.value) {
			$updateVisualization.mutate({
				tableId: $table.id.value,
				visualization: {
					id: dataItem.widget?.visualization?.id.value,
					type: dataItem.widget.visualization.type,
					name: value,
				},
			})
		}
	}
</script>

<div
	class={cn(
		'group flex flex-col bg-white !opacity-100 border rounded-md w-full h-full dark:bg-gray-700/50 dark:border-gray-500',
		!$readonly && 'hover:border-primary-600 transition',
	)}
>
	<div class="flex justify-between items-center gap-1 border-b border-gray-200 dark:border-gray-500 p-3 grow-0 h-10">
		<div class="flex items-center gap-1">
			{#if movePointerDown}
				<i
					on:pointerdown={movePointerDown}
					class=" opacity-0 group-hover:opacity-100 group-hover:block text-gray-500 ti ti-grip-vertical cursor-grab dark:text-gray-200"
				/>
			{/if}
			{#if dataItem.widget?.visualization}
				{#if updating && !$readonly}
					<input
						class="p-0 rounded-sm active:outline-gray-200"
						type="text"
						bind:this={ref}
						value={dataItem.widget.visualization.name.value}
						on:blur={blur}
					/>
				{:else}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span on:click={() => (updating = true)} class="font-semibold text-sm dark:text-gray-100">
						{dataItem.widget?.visualization.name.value}
					</span>
				{/if}
			{/if}
		</div>
		{#if !$readonly}
			<div class="items-center gap-2 opacity-0 group-hover:opacity-100">
				<button
					class="hover:bg-slate-100 w-6 h-6 dark:hover:bg-gray-300"
					on:click={() => {
						visualizationModal.open()
						$currentVisualizationId = dataItem.widget?.visualization?.id.value
					}}
				>
					<i class="text-gray-400 ti ti-arrows-diagonal dark:text-gray-200" />
				</button>

				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<button class="hover:bg-slate-100 w-6 h-6 dark:hover:bg-gray-300">
							<i class="text-gray-400 ti ti-dots dark:text-gray-200" />
						</button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Item
								class="gap-2 text-xs"
								on:click={() => {
									visualizationModal.open()
									$currentVisualizationId = dataItem.widget?.visualization?.id.value
								}}
							>
								<i class="text-gray-400 ti ti-arrows-diagonal dark:text-gray-200" />
								<span>
									{$t('full screen', { ns: 'common' })}
								</span>
							</DropdownMenu.Item>
							<DropdownMenu.Separator></DropdownMenu.Separator>
							<DropdownMenu.Item
								class="text-xs text-red-400 gap-2 flex items-center"
								on:click={() => {
									if (dataItem.widget) {
										$deleteWidget.mutate({
											tableId: $table.id.value,
											viewId: $view.id.value,
											widgetId: dataItem.widget.id.value,
										})
									}
								}}
							>
								<i class="ti ti-trash" />
								<span>
									{$t('delete widget')}
								</span>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		{/if}
	</div>
	<div class="flex items-center justify-center p-2 flex-1">
		<Visualization visualization={dataItem.widget?.visualization} />
	</div>
	{#if resizePointerDown}
		<i
			class="absolute right-0 bottom-0 cursor-se-resize
				hidden group-hover:block text-3xl text-primary-400
				ti ti-chevron-down-right"
			on:pointerdown={resizePointerDown}
		/>
	{/if}
</div>
