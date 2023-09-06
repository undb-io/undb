<script lang="ts">
	import { visualizationModal } from '$lib/store/modal'
	import Visualization from './Visualization.svelte'
	import VisualizationSetting from './setting/VisualizationSetting.svelte'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import { currentVisualization, getTable, getView } from '$lib/store/table'
	import * as Dialog from '$lib/components/ui/dialog'

	const table = getTable()

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

	const blur = (event: Event) => {
		updating = false
		const target = event.target as HTMLInputElement
		const value = target.value
		if ($currentVisualization) {
			$updateVisualization.mutate({
				tableId: $table.id.value,
				visualization: {
					id: $currentVisualization.id.value,
					type: $currentVisualization.type,
					name: value,
				},
			})
		}
	}
</script>

<div id="visualization-modal">
	<Dialog.Root bind:open={$visualizationModal.open}>
		<Dialog.Content class="!w-[95%] !max-w-none h-[95%] block">
			<Dialog.Header>
				<Dialog.Title>
					{#if $currentVisualization && updating}
						<input
							class="p-0 rounded-sm active:outline-gray-200"
							type="text"
							bind:this={ref}
							bind:value={$currentVisualization.name.value}
							on:blur={blur}
						/>
					{:else}
						<h1 on:click={() => (updating = true)}>{$currentVisualization?.name.value}</h1>
					{/if}
				</Dialog.Title>
			</Dialog.Header>

			<div class="flex items-center h-full w-full">
				<Visualization
					visualization={$currentVisualization}
					class="text-[200px] h-full flex-1 w-full dark:text-gray-200"
				/>
				<div class="flex flex-col h-full shrink-0 w-[400px] pl-2">
					<VisualizationSetting visualization={$currentVisualization} />
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Root>
</div>

<style>
	:global(#visualization-modal .max-w-7xl) {
		max-width: 100%;
	}
</style>
