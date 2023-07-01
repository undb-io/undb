<script lang="ts">
	import { Anchor, Node } from 'svelvet'
	import type { Table as CoreTable } from '@undb/core'
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte'
	import { t } from '$lib/i18n'

	export let table: CoreTable
</script>

<Node useDefaults id={table.id.value} label={table.name.value}>
	{#each table.schema.referenceFields as referenceField}
		<!-- <Anchor id={referenceField.id.value} output /> -->
	{/each}
	<div class="flex items-center justify-center p-2">{table.name.value}</div>

	<Table>
		<TableHead>
			<TableHeadCell>id</TableHeadCell>
			<TableHeadCell>{$t('Name', { ns: 'common' })}</TableHeadCell>
			<TableHeadCell>type</TableHeadCell>
		</TableHead>

		<TableBody tableBodyClass="divide-y">
			<TableBodyRow />
			{#each table.schema.fields as field}
				<TableBodyRow>
					<TableBodyCell>{field.id.value}</TableBodyCell>
					<TableBodyCell>{field.name.value}</TableBodyCell>
					<TableBodyCell>{$t(field.type)}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</Node>
