<script lang="ts">
	import { IconRowInsertTop } from '@tabler/icons-svelte'
	import type { Records } from '@undb/core'
	import { Button } from 'flowbite-svelte'
	import KanbanCard from './KanbanCard.svelte'

	// TODO: get from context
	export let records: Records
</script>

<div class="w-[350px]">
	<div class="mb-3">
		<div class="min-h-[40px]">
			<slot name="title" />
		</div>

		<Button color="alternative" class="w-full rounded-none h-8" size="xs">
			<IconRowInsertTop />
		</Button>
	</div>

	<div class="flex flex-col gap-2">
		{#each records as record}
			<KanbanCard {record} />
		{/each}
	</div>
</div>
