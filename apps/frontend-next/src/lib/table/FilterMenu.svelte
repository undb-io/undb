<script lang="ts">
	import { Popover, PopoverButton, PopoverPanel } from '@rgossiaux/svelte-headlessui'
	import { Button, Hr } from 'flowbite-svelte'
	import { IconFilter } from '@tabler/icons-svelte'
	import { filters } from '$lib/store/filter'
	import autoAnimate from '@formkit/auto-animate'
	import { fade } from 'svelte/transition'
	import FilterItem from './FilterItem.svelte'
	import { createPopperActions } from 'svelte-popperjs'

	const [popperRef, popperContent] = createPopperActions()

	const popperOptions = {
		strategy: 'fixed',
		modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
	}

	async function apply() {
		console.log($filters)
	}
</script>

<Popover class="relative z-10" let:open>
	<PopoverButton as="div" use={[popperRef]}>
		<Button id="filters-menu" size="xs" color="alternative" class="h-full !rounded-md gap-2">
			<IconFilter size={16} />
			Filters</Button
		>
	</PopoverButton>
	{#if open}
		<div transition:fade={{ duration: 100 }}>
			<PopoverPanel class="absolute" use={[[popperContent, popperOptions]]}>
				<div class="rounded-sm shadow-xl bg-white w-[600px] px-3 py-3 space-y-2 border border-gray-200">
					{#if $filters.length}
						<span class="text-xs font-medium text-gray-500">set filters in this view</span>
						<ul class="space-y-2" use:autoAnimate={{ duration: 100 }}>
							{#each $filters as filter, index}
								<FilterItem {filter} {index} />
							{/each}
						</ul>
					{:else}
						<span class="text-xs font-medium text-gray-400">no filters applied</span>
					{/if}
					<Hr />
					<div class="flex justify-between">
						<div>
							<Button color="alternative" size="xs" on:click={filters.add}>Add New Filter</Button>
						</div>
						<div>
							<Button size="xs" on:click={apply}>Apply</Button>
						</div>
					</div>
				</div>
			</PopoverPanel>
		</div>
	{/if}
</Popover>
