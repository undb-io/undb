<script lang="ts">
	import { visualizationModal } from '$lib/store/modal'
	import { Modal } from 'flowbite-svelte'
	import Visualization from './Visualization.svelte'
	import VisualizationSetting from './setting/VisualizationSetting.svelte'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import { currentVisualization, getTable, getView } from '$lib/store/table'

	const table = getTable()
	const view = getView()

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
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<Modal size="xl" class="w-full h-[calc(100vh-64px)] p-0" bind:open={$visualizationModal.open}>
		<svelte:fragment slot="header">
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
		</svelte:fragment>
		<div class="flex items-center h-full w-full ">
			<Visualization visualization={$currentVisualization} class="text-[200px] h-full flex-1 w-full dark:text-gray-200" />
			<div class="flex flex-col h-full shrink-0 w-[400px] pl-2">
				<VisualizationSetting visualization={$currentVisualization} />
			</div>
		</div>
	</Modal>
</div>

<style>
	:global(#visualization-modal .max-w-7xl) {
		max-width: 100%;
	}
</style>
