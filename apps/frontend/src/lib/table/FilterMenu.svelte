<script lang="ts">
	import { Button } from '$components/ui/button'
	import { trpc } from '$lib/trpc/client'
	import { filters, getTable, getView, q, recordHash } from '$lib/store/table'
	import { t } from '$lib/i18n'
	import { invalidate } from '$app/navigation'
	import FilterEditor from '$lib/filter/FilterEditor.svelte'
	import { getValidFilters } from '$lib/filter/filter.util'
	import { hasPermission } from '$lib/store/authz'
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover'
	import * as Alert from '$lib/components/ui/alert'
	import { writable } from 'svelte/store'
	import type { IFilter } from '@undb/core'
	import { cn } from '$lib/utils'
	import { toast } from 'svelte-sonner'

	$: value = writable<Partial<IFilter>[]>($filters)

	$: validFilters = getValidFilters($value)

	const table = getTable()
	const view = getView()

	const data = trpc().record.list.query(
		{ tableId: $table.id.value, viewId: $view.id.value, q: $q },
		{ enabled: false, refetchOnMount: false, refetchOnWindowFocus: true, queryHash: $recordHash },
	)

	const setFilter = trpc().table.view.filter.set.mutation({
		async onSuccess() {
			toast.success($t('TABLE.FILTER_SET', { ns: 'success' }))
			open = false
			await invalidate(`table:${$table.id.value}`)
			await $data.refetch()
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

	async function apply() {
		$setFilter.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			filter: getValidFilters($value),
		})
	}

	let open = false
</script>

<Popover positioning={{ placement: 'bottom-start' }} closeOnEscape bind:open>
	<PopoverTrigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="ghost"
			class={cn(
				'gap-2 whitespace-nowrap border-2 border-transparent',
				!!validFilters.length &&
					'bg-green-100 hover:bg-green-100 hover:border-green-200 text-green-800 hover:text-green-950 dark:bg-green-600 dark:text-green-100',
				open && !!validFilters.length && 'border-green-200 text-green-950',
				open && !validFilters.length && 'bg-gray-100',
			)}
			size="sm"
		>
			<i class="ti ti-filter text-sm" />

			{#if validFilters.length}
				<span>
					{validFilters.length}
				</span>
			{/if}

			<span>
				{$t('Filter')}
			</span>
		</Button>
	</PopoverTrigger>
	<PopoverContent class="w-[800px]">
		<form on:submit|preventDefault={apply} id="filter_menu" class="space-y-4">
			{#if $hasPermission('table:set_view_filter')}
				<span class="text-xs font-medium text-gray-500 dark:text-gray-300">{$t('set filters in this view')}</span>
			{/if}
			<FilterEditor bind:value={$value} let:add readonly={!$hasPermission('table:set_view_filter')}>
				<svelte:fragment slot="empty">
					<Alert.Root>
						<Alert.Title>
							{$t('no filters applied')}
						</Alert.Title>
					</Alert.Root>
				</svelte:fragment>
				<div class="flex w-full justify-between">
					<Button
						class="bg-unset border-gray-200 border text-gray-900 dark:hover:bg-gray-900 hover:text-primary hover:bg-gray-100"
						size="sm"
						type="button"
						on:click={add}
					>
						{$t('Create New Filter')}
					</Button>
					<div>
						<Button size="sm" type="submit" variant="secondary">
							{$t('Cancel', { ns: 'common' })}
						</Button>
						<Button size="sm" type="submit" form="filter_menu">
							{$t('Apply', { ns: 'common' })}
						</Button>
					</div>
				</div>
			</FilterEditor>
		</form>
	</PopoverContent>
</Popover>
