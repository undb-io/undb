<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { FilterIcon } from 'lucide-svelte';
	import FiltersEditor from '../filters-editor/filters-editor.svelte';
	import type { IFilterGroup, MaybeFilterGroup } from '@undb/table';
	import { getTable } from '$lib/store/table.store';
	import { trpc } from '$lib/trpc/client';
	import { createMutation } from '@tanstack/svelte-query';
	import { invalidateAll } from '$app/navigation';
	import { writable } from 'svelte/store';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	const table = getTable();
	const value = writable<MaybeFilterGroup | undefined>();
	$: filter = $table.views.getViewById().filter.into(undefined);

	$: $table, value.set(filter?.toJSON() as MaybeFilterGroup);
	$: count = filter?.count ?? 0;

	let open = false;

	const mutation = createMutation({
		mutationKey: [$table.id.value, 'setFilters'],
		mutationFn: trpc.table.view.setFilter.mutate,
		onSuccess: () => {
			invalidateAll();
			open = false;
		}
	});

	const handleSubmit = (filter?: IFilterGroup) => {
		if (!filter) return;
		$mutation.mutate({
			filter,
			tableId: $table.id.value
		});
	};
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} size="sm">
			<FilterIcon class="mr-2 h-4 w-4" />
			Filters
			{#if count}
				<Badge variant="secondary" class="ml-2 rounded-full">{count}</Badge>
			{/if}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[500px]" align="start">
		<FiltersEditor bind:value={$value} table={$table} on:submit={(e) => handleSubmit(e.detail)} />
	</Popover.Content>
</Popover.Root>
