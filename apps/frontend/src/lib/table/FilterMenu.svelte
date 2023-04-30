<script lang="ts">
	import cx from 'classnames'
	import { Popover, PopoverButton, PopoverPanel } from '@rgossiaux/svelte-headlessui'
	import { Badge, Button, Hr, Toast } from 'flowbite-svelte'
	import autoAnimate from '@formkit/auto-animate'
	import { fade, slide } from 'svelte/transition'
	import FilterItem from './FilterItem.svelte'
	import { createPopperActions } from 'svelte-popperjs'
	import { trpc } from '$lib/trpc/client'
	import { filters, getTable, getView } from '$lib/store/table'
	import type { Field, IFilter } from '@undb/core'
	import { invalidateAll } from '$app/navigation'
	import { writable } from 'svelte/store'
	import { t } from '$lib/i18n'

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

	const setFilter = trpc.table.view.filter.set.mutation({
		async onSuccess() {
			await invalidateAll()
		},
	})
	async function apply() {
		const validFilters = $value.filter((v) => !!v.path && !!v.operator && !!v.type) as IFilter[]

		$setFilter.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			filter: validFilters,
		})
	}
</script>

<Popover class="relative z-10" let:open>
	<PopoverButton as="div" use={[popperRef]}>
		<Button
			id="filters-menu"
			size="xs"
			color="alternative"
			class={cx(
				'h-full !rounded-md gap-2 whitespace-nowrap',
				!!$filters.length && 'bg-blue-100 hover:bg-blue-100 border-0',
			)}
		>
			<span class="inline-flex items-center gap-2" class:text-blue-600={!!$filters.length}>
				<i class="ti ti-filter text-sm" />
				{$t('Filter')}

				{#if !!$filters.length}
					<Badge class="rounded-full h-4 px-2 bg-blue-700 !text-white">{$filters.length}</Badge>
				{/if}
			</span>
		</Button>
	</PopoverButton>
	{#if open}
		<div transition:fade={{ duration: 100 }}>
			<PopoverPanel class="absolute" use={[[popperContent, popperOptions]]} let:close>
				<form
					on:submit|preventDefault={async () => {
						await apply()
						close(null)
					}}
					class="rounded-sm shadow-xl bg-white w-[600px] px-3 py-3 space-y-2 border border-gray-200"
				>
					{#if $value.length}
						<span class="text-xs font-medium text-gray-500">{$t('set filters in this view')}</span>
						<ul class="space-y-2" use:autoAnimate={{ duration: 100 }}>
							{#each $value as filter, index}
								<FilterItem {filter} {index} {reset} {remove} />
							{/each}
						</ul>
					{:else}
						<span class="text-xs font-medium text-gray-400">{$t('no filters applied')}</span>
					{/if}
					<Hr />
					<div class="flex justify-between">
						<div>
							<Button color="alternative" size="xs" on:click={add}>{$t('Create New Filter')}</Button>
						</div>
						<div>
							<Button size="xs" type="submit">{$t('Apply', { ns: 'common' })}</Button>
						</div>
					</div>
				</form>
			</PopoverPanel>
		</div>
	{/if}
</Popover>

{#if $setFilter.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$setFilter.error.message}
		</span>
	</Toast>
{/if}
