<script lang="ts">
	import cx from 'classnames'
	import { Badge, Button, Hr } from 'flowbite-svelte'
	import { getTable, getView, sorts } from '$lib/store/table'
	import type { ISortSchema } from '@undb/core'
	import FieldPicker from '$lib/field/FieldInputs/FieldPicker.svelte'
	import { writable } from 'svelte/store'
	import { Popover, PopoverButton, PopoverPanel } from '@rgossiaux/svelte-headlessui'
	import autoAnimate from '@formkit/auto-animate'
	import { fade } from 'svelte/transition'
	import { createPopperActions } from 'svelte-popperjs'
	import type { SetOptional } from 'type-fest'
	import { trpc } from '$lib/trpc/client'
	import { page } from '$app/stores'
	import { invalidate } from '$app/navigation'

	const table = getTable()
	const view = getView()

	const value = writable<SetOptional<ISortSchema, 'fieldId'>[]>([])
	$: value.set($sorts.length ? [...$sorts] : [{ direction: 'asc' }])
	$: selected = $value.filter((v) => !!v.fieldId).map((v) => v.fieldId)

	const directions = ['asc', 'desc'] as const

	const [popperRef, popperContent] = createPopperActions()

	const popperOptions = {
		strategy: 'fixed',
		modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
	}

	async function sort() {
		const validSorts = $value.filter((v) => !!v.fieldId && v.direction) as ISortSchema[]

		await trpc($page).table.view.sort.set.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			sorts: validSorts,
		})

		await invalidate(`table:${$table.id.value}`)
	}
</script>

<Popover class="relative z-10" let:open>
	<PopoverButton as="div" use={[popperRef]}>
		<Button
			size="xs"
			color="light"
			class={cx('h-full !rounded-md', !!$sorts.length && 'bg-blue-100 hover:bg-blue-100 border-0 whitespace-nowrap')}
		>
			<span class="inline-flex items-center gap-2" class:text-blue-600={!!$sorts.length}>
				<i class="ti ti-arrows-sort text-sm" />
				<span>Sorts</span>
				{#if !!$sorts.length}
					<Badge class="rounded-full h-4 px-2 bg-blue-700 !text-white">{$sorts.length}</Badge>
				{/if}
			</span>
		</Button>
	</PopoverButton>
	{#if open}
		<div transition:fade={{ duration: 100 }}>
			<PopoverPanel class="absolute" use={[[popperContent, popperOptions]]} let:close>
				<div class="rounded-sm shadow-xl bg-white w-[400px] px-3 py-3 space-y-2 border border-gray-200">
					{#if $value.length}
						<span class="text-xs font-medium text-gray-500">set filters in this view</span>
						<ul class="w-full items-center space-y-2" use:autoAnimate={{ duration: 100 }}>
							{#each $value as sort, idx}
								<li class="flex justify-between">
									<div class="flex">
										<FieldPicker
											bind:value={sort.fieldId}
											table={$table}
											size="xs"
											class="w-48 rounded-r-none !justify-start border-r-0"
											filter={(f) => f.sortable && !selected.includes(f.id.value)}
										/>
										<div class="inline-flex w-1/2">
											{#each directions as direction, i (direction)}
												<Button
													size="xs"
													class={cx('!rounded-none', i === 1 && '!rounded-r-md border-l-0')}
													on:click={() => {
														value.update((sort) => sort.map((s, index) => (index === idx ? { ...s, direction } : s)))
													}}
													color={sort.direction === direction ? 'blue' : 'light'}>{direction}</Button
												>
											{/each}
										</div>
									</div>

									<button
										on:click|preventDefault|stopPropagation={() => {
											value.update((sorts) => sorts.filter((_, index) => index !== idx))
										}}
									>
										<i class="ti ti-trash text-gray-500" />
									</button>
								</li>
							{/each}
						</ul>
					{:else}
						<span class="text-xs font-medium text-gray-400">no filters applied</span>
					{/if}
					<Hr />
					<div class="flex justify-between">
						<div>
							<Button
								color="alternative"
								size="xs"
								on:click={() => value.update((sorts) => [...sorts, { direction: 'asc' }])}>Add New Sort</Button
							>
						</div>
						<div>
							<Button
								size="xs"
								on:click={async () => {
									await sort()
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
