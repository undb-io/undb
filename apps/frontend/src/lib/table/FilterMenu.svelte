<script lang="ts">
	import { Toast } from 'flowbite-svelte'
	import { Button } from '$components/ui/button'
	import { slide } from 'svelte/transition'
	import { trpc } from '$lib/trpc/client'
	import { filters, getTable, getView, q, recordHash } from '$lib/store/table'
	import { t } from '$lib/i18n'
	import { invalidate } from '$app/navigation'
	import FilterEditor from '$lib/filter/FilterEditor.svelte'
	import { getValidFilters } from '$lib/filter/filter.util'
	import { hasPermission } from '$lib/store/authz'
	import * as Popover from '$lib/components/ui/popover'

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

<Popover.Root positioning={{ placement: 'bottom-start' }} closeOnOutsideClick={false} closeOnEscape bind:open>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} variant="secondary" class="gap-2 whitespace-nowrap" size="sm">
			<i class="ti ti-filter text-sm" />
			{$t('Filter')}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[800px]">
		<form on:submit|preventDefault={apply} id="filter_menu" class="space-y-4">
			{#if $hasPermission('table:set_view_filter')}
				<span class="text-xs font-medium text-gray-500 dark:text-gray-300">{$t('set filters in this view')}</span>
			{/if}
			<FilterEditor bind:value let:add readonly={!$hasPermission('table:set_view_filter')}>
				<div class="flex w-full justify-between">
					<Button
						class="bg-unset border-gray-200 border text-gray-900 dark:hover:bg-gray-900 hover:text-primary hover:bg-gray-100"
						size="sm"
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
	</Popover.Content>
</Popover.Root>

{#if $setFilter.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$setFilter.error.message}
		</span>
	</Toast>
{/if}
