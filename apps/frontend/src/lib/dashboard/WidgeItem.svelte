<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { currentVisualizationId, getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import Visualization from '$lib/visualization/Visualization.svelte'
	import { Dropdown, DropdownDivider, DropdownItem } from 'flowbite-svelte'
	import type { WidgeDataItem } from './widge-item.type'
	import { t } from '$lib/i18n'
	import { COLS, widgeItems } from '$lib/store/widge'
	import type { IRelayoutWidgeSchema } from '@undb/core'
	import { visualizationModal } from '$lib/store/modal'

	const table = getTable()
	const view = getView()

	export let dataItem: WidgeDataItem
	export let movePointerDown: (e: Event) => void
	export let resizePointerDown: (e: Event) => void

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

	const relayoutWidges = trpc().table.view.dashboard.relayoutWidges.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const deleteWidge = trpc().table.view.dashboard.deleteWidge.mutation({
		async onSuccess(data, variables, context) {
			if (!dataItem.widge) return
			const items = widgeItems.remove(dataItem.widge.id.value)
			const widges: IRelayoutWidgeSchema[] = items.map((item) => {
				const { x, y, h, w } = item[COLS]
				const layout = { x, y, h, w }
				return { id: item.id, layout }
			})
			$relayoutWidges.mutate({
				tableId: $table.id.value,
				viewId: $view.id.value,
				widges,
			})
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const blur = (event: Event) => {
		updating = false
		const target = event.target as HTMLInputElement
		const value = target.value
		if (dataItem.widge?.visualization && value !== dataItem.widge?.visualization?.name.value) {
			$updateVisualization.mutate({
				tableId: $table.id.value,
				visualization: {
					id: dataItem.widge?.visualization?.id.value,
					type: dataItem.widge.visualization.type,
					name: value,
				},
			})
		}
	}
</script>

<div class="group flex flex-col bg-white !opacity-100 border rounded-md w-full h-full hover:border-blue-600 transition">
	<div class="flex justify-between items-center gap-1 border-b border-gray-200 p-3 grow-0 h-10">
		<div class="flex items-center gap-1">
			<i
				on:pointerdown={movePointerDown}
				class=" opacity-0 group-hover:opacity-100 group-hover:block text-gray-500 ti ti-grip-vertical cursor-grab"
			/>
			{#if dataItem.widge?.visualization}
				{#if updating}
					<input
						class="p-0 rounded-sm active:outline-gray-200"
						type="text"
						bind:this={ref}
						value={dataItem.widge.visualization.name.value}
						on:blur={blur}
					/>
				{:else}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span on:click={() => (updating = true)} class="font-semibold text-sm">
						{dataItem.widge?.visualization.name.value}
					</span>
				{/if}
			{/if}
		</div>
		<div class="items-center gap-2 hidden group-hover:flex">
			<button
				class="hover:bg-slate-100 w-6 h-6"
				on:click={() => {
					visualizationModal.open()
					$currentVisualizationId = dataItem.widge?.visualization?.id.value
				}}
			>
				<i class="text-gray-400 ti ti-arrows-diagonal" />
			</button>
			<button class="hover:bg-slate-100 w-6 h-6">
				<i class="text-gray-400 ti ti-dots" />
			</button>
			<Dropdown>
				<DropdownItem
					class="text-gray-600 text-xs gap-2 flex items-center"
					on:click={() => {
						visualizationModal.open()
						$currentVisualizationId = dataItem.widge?.visualization?.id.value
					}}
				>
					<i class="text-gray-400 ti ti-arrows-diagonal" />
					<span>
						{$t('full screen', { ns: 'common' })}
					</span>
				</DropdownItem>
				<DropdownDivider />
				<DropdownItem
					class="text-xs text-red-400 gap-2 flex items-center"
					on:click={() => {
						if (dataItem.widge) {
							$deleteWidge.mutate({
								tableId: $table.id.value,
								viewId: $view.id.value,
								widgeId: dataItem.widge.id.value,
							})
						}
					}}
				>
					<i class="ti ti-trash" />
					<span>
						{$t('delete widge')}
					</span>
				</DropdownItem>
			</Dropdown>
		</div>
	</div>
	<div class="flex items-center justify-center p-2 flex-1">
		<Visualization visualization={dataItem.widge?.visualization} />
	</div>
	<i
		class="absolute right-0 bottom-0 cursor-se-resize
				hidden group-hover:block text-3xl text-blue-400
				ti ti-chevron-down-right"
		on:pointerdown={resizePointerDown}
	/>
</div>
