<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { FilterIcon } from 'lucide-svelte';
	import FiltersEditor from '../filters-editor/filters-editor.svelte';
	import type { MaybeFilterGroup } from '@undb/table';
	import { getTable } from '$lib/store/table.store';

	const table = getTable();
	let value: MaybeFilterGroup | undefined = undefined;
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} size="xs">
			<FilterIcon class="mr-2 h-3 w-3" />
			Filters
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[500px]" align="start">
		<FiltersEditor bind:value table={$table} />
	</Popover.Content>
</Popover.Root>
