<script lang="ts">
	import { currentVirsualization, virsualizationOpen } from '$lib/store/modal'
	import { Modal } from 'flowbite-svelte'
	import Virsualization from './Virsualization.svelte'
	import VirsualizationSetting from './setting/VirsualizationSetting.svelte'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import { getTable } from '$lib/store/table'

	const table = getTable()
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
		if ($currentVirsualization) {
			$updateVirsualization.mutate({
				tableId: $table.id.value,
				virsualization: {
					id: $currentVirsualization.id.value,
					type: $currentVirsualization.type,
					name: value,
				},
			})
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<Modal size="xl" class="w-full h-[calc(100vh-64px)] p-0" bind:open={$virsualizationOpen} defaultClass="!p-0">
	<svelte:fragment slot="header">
		{#if $currentVirsualization && updating}
			<input
				class="p-0 rounded-sm active:outline-gray-200"
				type="text"
				bind:this={ref}
				bind:value={$currentVirsualization.name.value}
				on:blur={blur}
			/>
		{:else}
			<h1 on:click={() => (updating = true)}>{$currentVirsualization?.name.value}</h1>
		{/if}
	</svelte:fragment>
	<div class="flex items-center h-full">
		<Virsualization virsualization={$currentVirsualization} class="text-[350px] h-full" />
		<div class="flex flex-col h-full basis-[400px] pl-2">
			<VirsualizationSetting virsualization={$currentVirsualization} />
		</div>
	</div>
</Modal>
