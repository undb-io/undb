<script lang="ts">
	import { cn } from '$lib/utils'
	import { allTableFields, getTable, getView, listRecordFn, sorts } from '$lib/store/table'
	import { isSortable, type ISortSchema } from '@undb/core'
	import FieldPicker from '$lib/field/FieldInputs/FieldPicker.svelte'
	import { writable } from 'svelte/store'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import { t } from '$lib/i18n'
	import Sortable, { type SortableEvent } from 'sortablejs'
	import { isNumber, uniqBy } from 'lodash-es'
	import { onMount } from 'svelte'
	import { hasPermission } from '$lib/store/authz'
	import { Button } from '$components/ui/button'
	import * as Popover from '$lib/components/ui/popover'
	import { Separator } from '$lib/components/ui/separator'
	import * as Alert from '$lib/components/ui/alert'
	import { toast } from 'svelte-sonner'

	const table = getTable()
	const view = getView()

	const TEMP_ID = '__TEMP_ID'
	$: value = writable<(Omit<ISortSchema, 'fieldId'> & { id: string })[]>([
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
		async onSuccess() {
			toast.success($t('TABLE.SORT_SET', { ns: 'success' }))
			await invalidate(`table:${$table.id.value}`)
			await $listRecords.refetch()
			open = false
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

	$: validSorts = $value
		.filter((v) => !!v.id && v.direction)
		.filter((v) => v.id !== TEMP_ID)
		.map((v) => ({ fieldId: v.id, direction: v.direction })) as ISortSchema[]

	async function sort() {
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

<Popover.Root positioning={{ placement: 'bottom-start' }} closeOnEscape bind:open>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="ghost"
			class={cn(
				'gap-2 whitespace-nowrap border-2 border-transparent',
				!!validSorts.length &&
					'bg-yellow-100 hover:bg-yellow-100 hover:border-yellow-200 text-yellow-800 hover:text-yellow-950 dark:bg-yellow-600 dark:text-yellow-100',
				open && !!validSorts.length && 'border-yellow-200 text-yellow-950',
				open && !validSorts.length && 'bg-gray-100',
			)}
			size="sm"
		>
			<i class="ti ti-arrows-sort text-sm" />
			{#if validSorts.length}
				<span>{validSorts.length}</span>
			{/if}
			<span>
				{$t('Sort')}
			</span>
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[400px]">
		<form id="sort_menu" class="space-y-4" on:submit={sort}>
			{#if $value.length}
				<span class="text-xs font-medium text-gray-500">{$t('set sorts in this view')}</span>
				<ul class="w-full items-center space-y-2" bind:this={el}>
					{#each $value as sort, idx (sort.id)}
						<li class="flex gap-2 items-center">
							{#if canSetViewSort}
								<i role="button" class="handle ti ti-grip-vertical flex items-center" />
							{/if}
							<div class="flex flex-1 items-center">
								<FieldPicker
									bind:value={sort.id}
									class="w-48 truncate rounded-r-none !justify-start border-r-0 h-8"
									fields={$allTableFields}
									filter={(f) => isSortable(f.type) && !$value.slice(0, idx).some((v) => v.id === f.id)}
									readonly={!canSetViewSort}
								/>
								<div class="inline-flex w-1/2">
									{#each directions as direction, i (direction)}
										<Button
											disabled={!canSetViewSort}
											type="button"
											size="sm"
											variant={sort.direction === direction ? 'default' : 'outline'}
											class={cn('!rounded-none text-xs whitespace-nowrap', i === 1 && '!rounded-r-md border-l-0')}
											on:click={(e) => {
												e.stopPropagation()
												value.update((sort) => sort.map((s, index) => (index === idx ? { ...s, direction } : s)))
											}}
										>
											{$t(direction, { ns: 'common' })}
										</Button>
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
				<Alert.Root>
					<Alert.Title>
						{$t('no sorts applied')}
					</Alert.Title>
				</Alert.Root>
			{/if}
		</form>
		{#if canSetViewSort}
			<Separator class="my-4" />

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
	</Popover.Content>
</Popover.Root>
