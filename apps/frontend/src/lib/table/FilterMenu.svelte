<script lang="ts">
	import { Popover, PopoverButton, PopoverPanel } from '@rgossiaux/svelte-headlessui'
	import { Button, Hr } from 'flowbite-svelte'
	import autoAnimate from '@formkit/auto-animate'
	import { fade } from 'svelte/transition'
	import FilterItem from './FilterItem.svelte'
	import { createPopperActions } from 'svelte-popperjs'
	import { trpc } from '$lib/trpc/client'
	import { page } from '$app/stores'
	import { filters, getTable, getView } from '$lib/store/table'
	import type { Field, IFilter } from '@undb/core'
	import { invalidateAll } from '$app/navigation'
	import { writable } from 'svelte/store'

	const [popperRef, popperContent] = createPopperActions()

	const popperOptions = {
		strategy: 'fixed',
		modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
	}

	const value = writable<Partial<IFilter>[]>([...$filters])

	const table = getTable()
	const view = getView()

	const add = () => {
		$value = [...$value, {}]
	}

	const reset = (index: number, field: Field | undefined) => {
		$value = $value.map((f, i) => (i !== index ? f : { path: field?.id.value, type: field?.type }))
	}

	const remove = (index: number) => {
		$value = $value.filter((f, i) => i !== index)
	}

	async function apply() {
		const validFilters = $value.filter((v) => !!v.path && !!v.operator && !!v.type) as IFilter[]
		await trpc($page).table.view.filter.set.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			filter: validFilters,
		})
		await invalidateAll()
	}
</script>

<Popover class="relative z-10" let:open>
	<PopoverButton as="div" use={[popperRef]}>
		<Button id="filters-menu" size="xs" color="alternative" class="h-full !rounded-md gap-2 whitespace-nowrap">
			<i class="ti ti-filter text-sm" />
			Filters</Button
		>
	</PopoverButton>
	{#if open}
		<div transition:fade={{ duration: 100 }}>
			<PopoverPanel class="absolute" use={[[popperContent, popperOptions]]} let:close>
				<div class="rounded-sm shadow-xl bg-white w-[600px] px-3 py-3 space-y-2 border border-gray-200">
					{#if $value.length}
						<span class="text-xs font-medium text-gray-500">set filters in this view</span>
						<ul class="space-y-2" use:autoAnimate={{ duration: 100 }}>
							{#each $value as filter, index}
								<FilterItem {filter} {index} {reset} {remove} />
							{/each}
						</ul>
					{:else}
						<span class="text-xs font-medium text-gray-400">no filters applied</span>
					{/if}
					<Hr />
					<div class="flex justify-between">
						<div>
							<Button color="alternative" size="xs" on:click={add}>Add New Filter</Button>
						</div>
						<div>
							<Button
								size="xs"
								on:click={async () => {
									await apply()
									close(null)
								}}>Apply</Button
							>
						</div>
					</div>
				</div>
			</PopoverPanel>
		</div>
	{/if}
</Popover>
