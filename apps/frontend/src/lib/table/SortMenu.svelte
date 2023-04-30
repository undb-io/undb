<script lang="ts">
	import cx from 'classnames'
	import { Badge, Button, Modal, Toast } from 'flowbite-svelte'
	import { getTable, getView, sorts } from '$lib/store/table'
	import type { ISortSchema } from '@undb/core'
	import FieldPicker from '$lib/field/FieldInputs/FieldPicker.svelte'
	import { writable } from 'svelte/store'
	import { slide } from 'svelte/transition'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import { t } from '$lib/i18n'
	import { dndzone } from 'svelte-dnd-action'
	import { flip } from 'svelte/animate'

	const table = getTable()
	const view = getView()

	const TEMP_ID = '__TEMP'
	const value = writable<(Omit<ISortSchema, 'fieldId'> & { id?: string })[]>([])
	$: value.set(
		$sorts.length
			? [...$sorts.map((s) => ({ id: s.fieldId, direction: s.direction }))]
			: [{ id: TEMP_ID, direction: 'asc' }],
	)

	$: selected = $value.filter((v) => !!v.id).map((v) => v.id)

	const directions = ['asc', 'desc'] as const

	const setSort = trpc.table.view.sort.set.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			open = false
		},
	})

	async function sort() {
		const validSorts = $value
			.filter((v) => !!v.id && v.direction)
			.map((v) => ({ fieldId: v.id, direction: v.direction })) as ISortSchema[]

		$setSort.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			sorts: validSorts,
		})
	}
	function handleDndConsider(e: CustomEvent) {
		$value = e.detail.items
	}
	function handleDndFinalize(e: CustomEvent) {
		$value = e.detail.items
	}

	let open = false
</script>

<Button
	size="xs"
	color="light"
	class={cx('h-full !rounded-md whitespace-nowrap', !!$sorts.length && 'bg-blue-100 hover:bg-blue-100 border-0')}
	on:click={() => (open = true)}
>
	<span class="inline-flex items-center gap-2" class:text-blue-600={!!$sorts.length}>
		<i class="ti ti-arrows-sort text-sm" />
		<span class="whitespace-nowrap">{$t('Sort')}</span>
		{#if !!$sorts.length}
			<Badge class="rounded-full h-4 px-2 bg-blue-700 !text-white">{$sorts.length}</Badge>
		{/if}
	</span>
</Button>

<Modal bind:open class="w-full" size="sm" placement="top-center">
	<form id="sort_menu" class="space-y-4" on:submit={sort}>
		{#if $value.length}
			<span class="text-xs font-medium text-gray-500">{$t('set sorts in this view')}</span>
			<ul
				use:dndzone={{ items: $value, type: 'sorts', dropTargetStyle: {} }}
				class="w-full items-center space-y-2"
				on:consider={handleDndConsider}
				on:finalize={handleDndFinalize}
			>
				{#each $value as sort, idx (sort.id)}
					<li animate:flip={{ duration: 200 }} class="flex justify-between">
						<div class="flex">
							<FieldPicker
								bind:value={sort.id}
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
										color={sort.direction === direction ? 'blue' : 'light'}>{$t(direction, { ns: 'common' })}</Button
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
	</form>
	<svelte:fragment slot="footer">
		<div class="flex w-full justify-between">
			<Button
				color="alternative"
				size="xs"
				on:click={() => value.update((sorts) => [...sorts, { id: TEMP_ID, direction: 'asc' }])}
				disabled={$value.some((v) => v.id === TEMP_ID)}>{$t('Create New Sort')}</Button
			>
			<Button size="xs" type="submit" form="sort_menu">{$t('Apply', { ns: 'common' })}</Button>
		</div>
	</svelte:fragment>
</Modal>

{#if $setSort.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$setSort.error.message}
		</span>
	</Toast>
{/if}
