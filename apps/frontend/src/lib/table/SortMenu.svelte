<script lang="ts">
	import cx from 'classnames'
	import { Badge, Button, Hr, Toast } from 'flowbite-svelte'
	import { getTable, getView, sorts } from '$lib/store/table'
	import type { ISortSchema } from '@undb/core'
	import FieldPicker from '$lib/field/FieldInputs/FieldPicker.svelte'
	import { writable } from 'svelte/store'
	import { Popover, PopoverButton, PopoverPanel } from '@rgossiaux/svelte-headlessui'
	import autoAnimate from '@formkit/auto-animate'
	import { fade, slide } from 'svelte/transition'
	import { createPopperActions } from 'svelte-popperjs'
	import type { SetOptional } from 'type-fest'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import { t } from '$lib/i18n'

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

	const setSort = trpc.table.view.sort.set.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})
	async function sort() {
		const validSorts = $value.filter((v) => !!v.fieldId && v.direction) as ISortSchema[]

		$setSort.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			sorts: validSorts,
		})
	}
</script>

<Popover class="relative z-10" let:open>
	<PopoverButton as="div" use={[popperRef]}>
		<Button
			size="xs"
			color="light"
			class={cx('h-full !rounded-md whitespace-nowrap', !!$sorts.length && 'bg-blue-100 hover:bg-blue-100 border-0')}
		>
			<span class="inline-flex items-center gap-2" class:text-blue-600={!!$sorts.length}>
				<i class="ti ti-arrows-sort text-sm" />
				<span class="whitespace-nowrap">{$t('Sort')}</span>
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
						<span class="text-xs font-medium text-gray-500">{$t('set sorts in this view')}</span>
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
													color={sort.direction === direction ? 'blue' : 'light'}
													>{$t(direction, { ns: 'common' })}</Button
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
						<span class="text-xs font-medium text-gray-400">{$t('no sorts applied')}</span>
					{/if}
					<Hr />
					<div class="flex justify-between">
						<div>
							<Button
								color="alternative"
								size="xs"
								on:click={() => value.update((sorts) => [...sorts, { direction: 'asc' }])}
								>{$t('Create New Sort')}</Button
							>
						</div>
						<div>
							<Button
								size="xs"
								on:click={async () => {
									await sort()
									close(null)
								}}>{$t('Apply', { ns: 'common' })}</Button
							>
						</div>
					</div>
				</div>
			</PopoverPanel>
		</div>
	{/if}
</Popover>

{#if $setSort.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$setSort.error.message}
		</span>
	</Toast>
{/if}
