<script lang="ts">
	import cx from 'classnames'
	import { Alert, Badge, Modal, Toast } from 'flowbite-svelte'
	import { allTableFields, getTable, getView, listRecordFn, sorts } from '$lib/store/table'
	import { isSortable, type ISortSchema } from '@undb/core'
	import FieldPicker from '$lib/field/FieldInputs/FieldPicker.svelte'
	import { writable } from 'svelte/store'
	import { slide } from 'svelte/transition'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import { t } from '$lib/i18n'
	import Sortable, { type SortableEvent } from 'sortablejs'
	import { isNumber, uniqBy } from 'lodash-es'
	import { onMount } from 'svelte'
	import { hasPermission } from '$lib/store/authz'
	import { Button } from '$components/ui/button'

	const table = getTable()
	const view = getView()

	const TEMP_ID = '__TEMP_ID'
	const value = writable<(Omit<ISortSchema, 'fieldId'> & { id: string })[]>([
		...$sorts.map((s) => ({ id: s.fieldId, direction: s.direction })),
	])
	onMount(() => {
		value.set([...$sorts.map((s) => ({ id: s.fieldId, direction: s.direction }))])
	})

	const add = () => {
		$value = [...$value, { id: TEMP_ID, direction: 'asc' }]
	}

	const canSetViewSort = $hasPermission('table:set_view_sort')
	$: if (!$value.length && canSetViewSort) {
		add()
	}

	// TODO: move to core
	const directions = ['asc', 'desc'] as const

	const listRecords = $listRecordFn(undefined, { enabled: false })

	const setSort = trpc().table.view.sort.set.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			await $listRecords.refetch()
			open = false
		},
	})

	async function sort() {
		const validSorts = $value
			.filter((v) => !!v.id && v.direction)
			.filter((v) => v.id !== TEMP_ID)
			.map((v) => ({ fieldId: v.id, direction: v.direction })) as ISortSchema[]

		$setSort.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			sorts: uniqBy(validSorts, (s) => s.fieldId),
		})
	}

	let open = false
	const onEnd = (event: SortableEvent) => {
		const { oldIndex, newIndex } = event
		if (isNumber(oldIndex) && isNumber(newIndex)) {
			;[$value[oldIndex], $value[newIndex]] = [$value[newIndex], $value[oldIndex]]
		}
	}

	let el: HTMLUListElement
	$: if (el) {
		Sortable.create(el, {
			animation: 200,
			direction: 'vertical',
			onEnd,
			handle: '.handle',
		})
	}
</script>

<Button
	size="sm"
	color="light"
	class={cx(
		'whitespace-nowrap border-0 bg-[unset] hover:!bg-blue-50  dark:hover:!bg-gray-800 dark:bg-gray-700',
		!!$sorts.length && '!bg-blue-50 dark:!bg-primary-600',
	)}
	on:click={() => (open = true)}
>
	<span class="inline-flex items-center gap-2 text-blue-600 dark:text-gray-100">
		<i class="ti ti-arrows-sort text-sm" />
		<span class="whitespace-nowrap">{$t('Sort')}</span>
		{#if !!$sorts.length}
			<Badge class="rounded-full h-4 px-2 bg-blue-700 !text-white">{$sorts.length}</Badge>
		{/if}
	</span>
</Button>

<Modal bind:open class="w-full" size="lg" placement="top-center">
	<form id="sort_menu" class="space-y-4" on:submit={sort}>
		{#if $value.length}
			<span class="text-xs font-medium text-gray-500">{$t('set sorts in this view')}</span>
			<ul class="w-full items-center space-y-2" bind:this={el}>
				{#each $value as sort, idx (sort.id)}
					<li class="flex gap-2 items-center">
						{#if canSetViewSort}
							<i role="button" class="handle ti ti-grip-vertical flex items-center" />
						{/if}
						<div class="flex flex-1">
							<FieldPicker
								bind:value={sort.id}
								table={$table}
								size="xs"
								class="w-48 rounded-r-none !justify-start border-r-0"
								fields={$allTableFields}
								filter={(f) => isSortable(f.type)}
								readonly={!canSetViewSort}
							/>
							<div class="inline-flex w-1/2">
								{#each directions as direction, i (direction)}
									<Button
										disabled={!canSetViewSort}
										size="sm"
										class={cx('!rounded-none', i === 1 && '!rounded-r-md border-l-0')}
										on:click={() => {
											value.update((sort) => sort.map((s, index) => (index === idx ? { ...s, direction } : s)))
										}}
										color={sort.direction === direction ? 'blue' : 'light'}>{$t(direction, { ns: 'common' })}</Button
									>
								{/each}
							</div>
						</div>

						{#if canSetViewSort}
							<button
								on:click|preventDefault|stopPropagation={() => {
									value.update((sorts) => sorts.filter((_, index) => index !== idx))
								}}
							>
								<i class="ti ti-trash text-gray-500" />
							</button>
						{/if}
					</li>
				{/each}
			</ul>
		{:else}
			<Alert color="blue">{$t('no sorts applied')}</Alert>
		{/if}
	</form>
	{#if canSetViewSort}
		<div class="flex w-full justify-between">
			<Button
				color="alternative"
				size="sm"
				class="bg-unset border-gray-200 border text-gray-900 dark:hover:bg-gray-900 hover:text-primary hover:bg-gray-100"
				on:click={add}
				disabled={$value.some((v) => v.id === TEMP_ID) || $setSort.isLoading}
			>
				{$t('Create New Sort')}
			</Button>
			<Button size="sm" type="submit" form="sort_menu">{$t('Apply', { ns: 'common' })}</Button>
		</div>
	{/if}
</Modal>

{#if $setSort.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$setSort.error.message}
		</span>
	</Toast>
{/if}
