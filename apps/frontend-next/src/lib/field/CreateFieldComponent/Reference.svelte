<script lang="ts">
	import { page } from '$app/stores'
	import { Label } from 'flowbite-svelte'
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import type { IQueryTable } from '@undb/core'
	import DisplayFields from '../Inputs/DisplayFieldsPicker.svelte'
	import TablePicker from '../Inputs/TablePicker.svelte'

	export let form: SuperForm<UnwrapEffects<string>, unknown>

	const { value: foreignTableId } = formFieldProxy(form, 'foreignTableId')
	$: tables = $page.data.tables as IQueryTable[]

	const { value: displayFieldIds } = formFieldProxy(form, 'displayFieldIds')
	$: table = tables.find((table) => table.id === $foreignTableId)

	$: table, ($displayFieldIds = [] as never)
</script>

<div class="grid grid-cols-2 gap-2">
	<TablePicker bind:value={$foreignTableId} name="foreignTableId" />

	<div class="space-y-2">
		<Label class="inline-flex items-center gap-2">
			<span>display fields</span>
		</Label>
		{#if table}
			<div>
				<DisplayFields {table} bind:group={$displayFieldIds} disabled={!table} />
			</div>
		{/if}
	</div>
</div>
