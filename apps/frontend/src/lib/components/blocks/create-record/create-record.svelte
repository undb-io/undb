<script lang="ts">
	import { trpc } from '$lib/trpc/client';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import type { ITableDTO } from '@undb/table';

	export let table: ITableDTO;

	const client = useQueryClient();

	const createRecordMutation = createMutation({
		mutationFn: trpc.record.create.mutate,
		onSettled: () => {
			client.invalidateQueries({ queryKey: ['records', table.id] });
		}
	});

	const createRecord = () => {
		const field = table.schema.find((f) => f.type === 'string');
		if (!field) return;

		$createRecordMutation.mutate({
			tableId: table.id,
			values: {
				[field.id]: 'hello'
			}
		});
	};
</script>

create record
