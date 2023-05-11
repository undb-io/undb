<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { virsualizationOpen } from '$lib/store/modal'
	import { currentVirsualizationId, getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import Virsualization from '$lib/virsualization/Virsualization.svelte'
	import type { WidgeDataItem } from './widge-item.type'

	const table = getTable()

	export let dataItem: WidgeDataItem
	export let movePointerDown: (e: Event) => void
	export let resizePointerDown: (e: Event) => void

	export let updating = false

	let ref: HTMLInputElement

	$: if (updating) {
		ref?.focus()
	}

	const updateVirsualization = trpc().table.virsualization.update.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const blur = (event: Event) => {
		updating = false
		const target = event.target as HTMLInputElement
		const value = target.value
		if (dataItem.widge?.virsualization && value !== dataItem.widge?.virsualization?.name.value) {
			$updateVirsualization.mutate({
				tableId: $table.id.value,
				virsualization: {
					id: dataItem.widge?.virsualization?.id.value,
					type: dataItem.widge.virsualization.type,
					name: value,
				},
			})
		}
	}
</script>

<div class="group flex flex-col bg-white !opacity-100 border rounded-md w-full h-full hover:border-blue-400 transition">
	<div class="flex justify-between items-center gap-1 border-b border-gray-200 p-3 grow-0 h-10">
		<div class="flex items-center gap-1">
			<i
				on:pointerdown={movePointerDown}
				class=" opacity-0 group-hover:opacity-100 group-hover:block text-gray-500 ti ti-grip-vertical cursor-grab"
			/>
			{#if dataItem.widge?.virsualization}
				{#if updating}
					<input
						class="p-0 rounded-sm active:outline-gray-200"
						type="text"
						bind:this={ref}
						value={dataItem.widge.virsualization.name.value}
						on:blur={blur}
					/>
				{:else}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span on:click={() => (updating = true)} class="font-semibold text-sm">
						{dataItem.widge?.virsualization.name.value}
					</span>
				{/if}
			{/if}
		</div>
		<div class="items-center gap-2 hidden group-hover:flex">
			<button
				on:click={() => {
					$virsualizationOpen = true
					$currentVirsualizationId = dataItem.widge?.virsualization?.id.value
				}}
			>
				<i class="text-gray-400 ti ti-arrows-diagonal" />
			</button>
		</div>
	</div>
	<div class="flex items-center justify-center p-2 flex-1">
		<Virsualization virsualization={dataItem.widge?.virsualization} />
	</div>
	<i
		class="absolute right-0 bottom-0 cursor-se-resize
				hidden group-hover:block text-3xl text-blue-400
				ti ti-chevron-down-right"
		on:pointerdown={resizePointerDown}
	/>
</div>
