<script lang="ts">
	import { Render, Subscribe, createRender, createTable } from 'svelte-headless-table';
	import { writable } from 'svelte/store';
	import DataTableCheckbox from './grid-view-checkbox.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import { addSelectedRows } from 'svelte-headless-table/plugins';
	import { cn } from '$lib/utils.js';
	import type { IRecordsDTO } from '@undb/table';
	import { createQuery } from '@tanstack/svelte-query';
	import { trpc } from '$lib/trpc/client';
	import CreateRecordButton from '../create-record/create-record-button.svelte';
	import { getTable } from '$lib/store/table.store';
	import GridViewActions from './grid-view-actions.svelte';

	const t = getTable();

	$: tableId = $t.id.value;

	$: getRecords = createQuery({
		queryKey: ['records', tableId],
		queryFn: () => trpc.record.list.query({ tableId })
	});

	$: records = ($getRecords.data as IRecordsDTO | undefined) ?? [];
	// TODO: record type
	let data = writable<any[]>([]);
	$: records, data.set(records.map((r) => ({ id: r.id, ...r.values })));

	const table = createTable(data, {
		select: addSelectedRows()
	});

	$: columns =
		table.createColumns([
			table.display({
				header: (_, { pluginStates }) => {
					const { allPageRowsSelected } = pluginStates.select;
					return createRender(DataTableCheckbox, {
						checked: allPageRowsSelected
					});
				},
				cell: ({ row }, { pluginStates }) => {
					const { getRowState } = pluginStates.select;
					const { isSelected } = getRowState(row);

					return createRender(DataTableCheckbox, {
						checked: isSelected
					});
				}
			}),
			...($t.schema.fields ?? []).map((field) => {
				return table.column({
					header: field.name.value,
					accessor: field.id.value
				});
			}),
			table.column({
				header: '',
				accessor: ({ id }) => id,
				cell: (item) => {
					return createRender(GridViewActions, { id: item.value });
				}
			})
		]) ?? [];

	const viewModel = writable(table.createViewModel(columns ?? []));
	$: columns, viewModel.set(table.createViewModel(columns));

	$: headerRows = $viewModel.headerRows;
	$: pageRows = $viewModel.pageRows;
	$: tableAttrs = $viewModel.tableAttrs;
	$: tableBodyAttrs = $viewModel.tableBodyAttrs;
	$: rows = $viewModel.rows;

	$: selectedDataIds = $viewModel.pluginStates.select.selectedDataIds;
</script>

<div class="w-full">
	<div class="mb-4 flex items-center gap-4">
		<CreateRecordButton />
	</div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs} class={cn('[&:has([role=checkbox])]:pl-3')}>
										<Render of={cell.render()} />
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && 'selected'}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell class="[&:has([role=checkbox])]:pl-3" {...attrs}>
										{#if cell.id === 'amount'}
											<div class="text-right font-medium">
												<Render of={cell.render()} />
											</div>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-2 py-4">
		<div class="text-muted-foreground flex-1 text-sm">
			{Object.keys($selectedDataIds).length} of {$rows.length} row(s) selected.
		</div>
	</div>
</div>
