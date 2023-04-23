<script lang="ts">
	import { page } from '$app/stores'
	import { Label, Toggle } from 'flowbite-svelte'
	import { withPrevious } from 'svelte-previous'
	import { fieldProxy, formFieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import { TableFactory, type IQueryTable } from '@undb/core'
	import FieldsPicker from '../CreateFieldInputs/FieldsPicker.svelte'
	import TablePicker from '../CreateFieldInputs/TablePicker.svelte'
	import { getTable } from '$lib/context'

	export let form: SuperForm<UnwrapEffects<string>, unknown>

	const { value: foreignTableId } = formFieldProxy(form, 'foreignTableId')
	const { value: displayFieldIds } = formFieldProxy(form, 'displayFieldIds')
	const bidirectional = fieldProxy(form.form, 'bidirectional')

	const table = getTable()
	$: tables = $page.data.tables as IQueryTable[]
	$: foreignTable = tables.find((table) => table.id === $foreignTableId)
	$: coreForeignTable = foreignTable ? TableFactory.fromQuery(foreignTable) : undefined

	const [, previousForeignTableId] = withPrevious($foreignTableId)
	$: if ($foreignTableId && $foreignTableId !== previousForeignTableId) {
		$displayFieldIds = [] as never
	}
</script>

<div class="grid grid-cols-2 gap-2">
	<TablePicker bind:value={$foreignTableId} name="foreignTableId" />

	{#if coreForeignTable}
		<div class="space-y-2">
			<Label class="inline-flex items-center gap-2">
				<span>display fields</span>
			</Label>
			<div class="grid grid-cols-2 gap-2">
				<FieldsPicker table={coreForeignTable} bind:group={$displayFieldIds} disabled={!foreignTable} />
				{#if $table.id.value !== $foreignTableId}
					<Toggle bind:checked={$bidirectional}>bidirectional</Toggle>
				{/if}
			</div>
		</div>
	{/if}
</div>
