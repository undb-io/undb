<script lang="ts">
	import cx from 'classnames'
	import { Badge, Button, Modal, Toast } from 'flowbite-svelte'
	import { slide } from 'svelte/transition'
	import { trpc } from '$lib/trpc/client'
	import { filters, getTable, getView, q, recordHash } from '$lib/store/table'
	import { t } from '$lib/i18n'
	import { invalidate } from '$app/navigation'
	import FilterEditor from '$lib/filter/FilterEditor.svelte'
	import { getValidFilters } from '$lib/filter/filter.util'
	import { hasPermission } from '$lib/store/authz'

	let value = $filters

	const table = getTable()
	const view = getView()

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
		const validFilters = getValidFilters(value)

		$setFilter.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			filter: validFilters,
		})
	}

	let open = false
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
		<span class="text-xs font-medium text-gray-500 dark:text-gray-300">{$t('set filters in this view')}</span>
		<FilterEditor bind:value let:add readonly={!$hasPermission('table:set_view_filter')}>
			<div class="flex w-full justify-between">
				<Button color="alternative" size="xs" on:click={add}>
					{$t('Create New Filter')}
				</Button>
				<Button size="xs" type="submit" form="filter_menu">
					{$t('Apply', { ns: 'common' })}
				</Button>
			</div>
		</FilterEditor>
	</form>
</Modal>

{#if $setFilter.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$setFilter.error.message}
		</span>
	</Toast>
{/if}
