<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import type { ITableDTO } from '@undb/table';
	import { createRecordSheetOpen } from './create-record.store';
	import CreateRecord from './create-record.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	export let table: ITableDTO;
</script>

<Sheet.Root bind:open={$createRecordSheetOpen}>
	<Sheet.Content class="flex flex-col" transitionConfig={{ duration: 50 }}>
		<Sheet.Header>
			<Sheet.Title>Create Record</Sheet.Title>
		</Sheet.Header>

		<div class="flex-1">
			<CreateRecord {table} />
		</div>

		<Sheet.Footer>
			<Button variant="outline" on:click={() => ($createRecordSheetOpen = false)}>Cancel</Button>
			<Button>Create</Button>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
