<script lang="ts">
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms/index'
	import ReferenceFieldPicker from '../Inputs/ReferenceFieldPicker.svelte'
	import { getTable } from '$lib/context'
	import type { IQueryTable, ReferenceField, TreeField } from '@undb/core'
	import { page } from '$app/stores'
	import { Label } from 'flowbite-svelte'
	import FieldPicker from '../Inputs/FieldPicker.svelte'

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
</script>

<div class="grid grid-cols-2 gap-2">
	<ReferenceFieldPicker bind:value={$referenceFieldId} required {...$$restProps} />
	{#if foreignTable}
		<div class="space-y-2">
			<Label>
				<span>display fields</span>
			</Label>
			<FieldPicker
				table={foreignTable}
				bind:value={$aggregateFieldId}
				{...$$restProps}
				filter={(f) => f.isNumeric && !f.isAggregate}
			/>
		</div>
	{/if}
</div>
