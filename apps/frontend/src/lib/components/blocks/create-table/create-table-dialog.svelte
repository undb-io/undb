<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import type { createTableCommand } from '@undb/commands';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import CreateTable from './create-table.svelte';
	import { createTableOpened } from './create-table.store';

	export let data: SuperValidated<any>;
</script>

<Dialog.Root open={$createTableOpened} onOpenChange={(open) => createTableOpened.set(open)}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create Table</Dialog.Title>
		</Dialog.Header>

		<CreateTable {data} />
	</Dialog.Content>
</Dialog.Root>
