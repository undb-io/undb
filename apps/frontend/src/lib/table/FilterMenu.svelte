<script lang="ts">
	import cx from 'classnames'
	import { Badge, Button, Modal, Toast } from 'flowbite-svelte'
	import { slide } from 'svelte/transition'
	import FilterItem from './FilterItem.svelte'
	import { trpc } from '$lib/trpc/client'
	import { filters, getTable, getView, q, recordHash } from '$lib/store/table'
	import { isOperatorWithoutValue, type IFilter } from '@undb/core'
	import { writable } from 'svelte/store'
	import { t } from '$lib/i18n'
	import { invalidate } from '$app/navigation'
	import Sortable, { type SortableEvent } from 'sortablejs'
	import { isNumber } from 'lodash-es'

	const value = writable<Partial<IFilter>[]>([...$filters])
	$: value.set([...$filters])

	$: if (!$value.length) {
		add()
	}

	const table = getTable()
	const view = getView()

	const TEMP_ID = '__TEMP_ID'

	const add = () => {
		$value = [...$value, { path: TEMP_ID }]
	}

	const remove = (index: number) => {
		$value = $value.filter((f, i) => i !== index)
	}

	const data = trpc().record.list.query(
		{ tableId: $table.id.value, viewId: $view.id.value, q: $q },
		{ enabled: false, refetchOnMount: false, refetchOnWindowFocus: true, queryHash: $recordHash },
	)

	const setFilter = trpc().table.view.filter.set.mutation({
		async onSuccess() {
			open = false
			await invalidate(`table:${$table.id.value}`)
			await $data.refetch()
		},
	})
	async function apply() {
		const validFilters = $value.filter(
			(v) =>
				!!v.path && !!v.operator && !!v.type && (isOperatorWithoutValue(v.operator) ? true : v.value !== undefined),
		) as IFilter[]

		$setFilter.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			filter: validFilters,
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
	id="filters-menu"
	size="xs"
	color="alternative"
	on:click={() => (open = true)}
	class={cx(
		'h-full !rounded-md whitespace-nowrap border-0 hover:!bg-blue-50 dark:hover:!bg-gray-800',
		!!$filters.length && '!bg-blue-50 dark:!bg-primary-600',
	)}
>
	<span class="inline-flex items-center gap-2 text-blue-600 dark:text-gray-100">
		<i class="ti ti-filter text-sm" />
		{$t('Filter')}

		{#if !!$filters.length}
			<Badge class="rounded-full h-4 px-2 bg-blue-700 !text-white">{$filters.length}</Badge>
		{/if}
	</span>
</Button>
<Modal placement="top-center" bind:open class="w-full rounded-sm" size="lg">
	<form on:submit|preventDefault={apply} id="filter_menu" class="space-y-4">
		{#if $value.length}
			<span class="text-xs font-medium text-gray-500 dark:text-gray-300">{$t('set filters in this view')}</span>
			<ul class="space-y-2" bind:this={el}>
				{#each $value as filter, index (filter.path)}
					<FilterItem {filter} {index} {remove} />
				{/each}
			</ul>
		{:else}
			<span class="text-xs font-medium text-gray-400">{$t('no filters applied')}</span>
		{/if}
	</form>
	<div class="flex w-full justify-between">
		<Button color="alternative" size="xs" on:click={add}>{$t('Create New Filter')}</Button>
		<Button size="xs" type="submit" form="filter_menu">{$t('Apply', { ns: 'common' })}</Button>
	</div>
</Modal>

{#if $setFilter.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$setFilter.error.message}
		</span>
	</Toast>
{/if}
