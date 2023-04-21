<script lang="ts">
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms/index'
	import ReferenceFieldPicker from '../CreateFieldInputs/ReferenceFieldPicker.svelte'
	import { getTable } from '$lib/context'
	import { TableFactory, type IQueryTable, type ReferenceField, type TreeField } from '@undb/core'
	import { page } from '$app/stores'
	import { Alert, Label } from 'flowbite-svelte'
	import FieldPicker from '../CreateFieldInputs/FieldPicker.svelte'

	export let form: SuperForm<UnwrapEffects<string>, unknown>

	const table = getTable()
	$: schema = $table.schema.toIdMap()

	const referenceFieldId = fieldProxy(form.form, 'referenceFieldId')
	const aggregateFieldId = fieldProxy(form.form, 'aggregateFieldId')

	$: foreignTableId = $referenceFieldId
		? (schema.get($referenceFieldId) as ReferenceField | TreeField | undefined)?.foreignTableId.into() ??
		  $table.id.value
		: undefined
	$: tables = ($page.data.tables ?? []) as IQueryTable[]
	$: foreignTable = tables.find((t) => t.id === foreignTableId)

	$: coreTable = foreignTable ? TableFactory.fromQuery(foreignTable) : undefined
</script>

<div class="grid grid-cols-2 gap-2">
	<ReferenceFieldPicker bind:value={$referenceFieldId} required {...$$restProps} />
	{#if coreTable}
		<div class="space-y-2">
			<Label>
				<span>display fields</span>
			</Label>
			<FieldPicker
				table={coreTable}
				bind:value={$aggregateFieldId}
				{...$$restProps}
				filter={(f) => f.isNumeric && !f.isAggregate}
			>
				<Alert slot="empty" color="yellow">
					<span class="font-medium">Warning alert!</span> No numeric field for averageaggregate.
				</Alert>
			</FieldPicker>
		</div>
	{/if}
</div>
