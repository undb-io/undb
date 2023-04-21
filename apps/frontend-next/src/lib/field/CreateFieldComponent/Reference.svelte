<script lang="ts">
	import { page } from '$app/stores'
	import { Label } from 'flowbite-svelte'
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import { TableFactory, type IQueryTable } from '@undb/core'
	import FieldsPicker from '../CreateFieldInputs/FieldsPicker.svelte'
	import TablePicker from '../CreateFieldInputs/TablePicker.svelte'

	export let form: SuperForm<UnwrapEffects<string>, unknown>

	const { value: foreignTableId } = formFieldProxy(form, 'foreignTableId')
	$: tables = $page.data.tables as IQueryTable[]

	const { value: displayFieldIds } = formFieldProxy(form, 'displayFieldIds')
	$: table = tables.find((table) => table.id === $foreignTableId)

	$: table, ($displayFieldIds = [] as never)

	$: coreTable = table ? TableFactory.fromQuery(table) : undefined
</script>

<div class="grid grid-cols-2 gap-2">
	<TablePicker bind:value={$foreignTableId} name="foreignTableId" />

	{#if coreTable}
		<div class="space-y-2">
			<Label class="inline-flex items-center gap-2">
				<span>display fields</span>
			</Label>
			<div>
				<FieldsPicker table={coreTable} bind:group={$displayFieldIds} disabled={!table} />
			</div>
		</div>
	{/if}
</div>
