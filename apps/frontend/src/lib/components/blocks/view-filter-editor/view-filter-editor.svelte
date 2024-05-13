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

	const table = getTable();
	let value: MaybeFilterGroup | undefined = undefined;

	const mutation = createMutation({
		mutationKey: [$table.id.value, 'setFilters'],
		mutationFn: trpc.table.view.setFilter.mutate,
		onSuccess: () => {
			invalidateAll();
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

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} size="xs">
			<FilterIcon class="mr-2 h-3 w-3" />
			Filters
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[500px]" align="start">
		<FiltersEditor bind:value table={$table} on:submit={(e) => handleSubmit(e.detail)} />
	</Popover.Content>
</Popover.Root>
