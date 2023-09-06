<script lang="ts">
	import { cn } from '$lib/utils'
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms/index'
	import ReferenceFieldPicker from '../FieldInputs/ReferenceFieldPicker.svelte'
	import { getForeignTableFieldsByReferenceId, getTable, tableById } from '$lib/store/table'
	import { type ReferenceField, type TreeField, isNumeric, isAggregate, Table } from '@undb/core'
	import FieldPicker from '../FieldInputs/FieldPicker.svelte'
	import type { Writable } from 'svelte/store'
	import { t } from '$lib/i18n'
	import { Label } from '$components/ui/label'

	export let form: SuperForm<UnwrapEffects<string>, unknown>
	export let path: any[] = []

	const table = getTable()
	$: schema = $table.schema.toIdMap()

	const referenceFieldId = fieldProxy(form.form, [...path, 'referenceFieldId'] as any) as Writable<string>
	const aggregateFieldId = fieldProxy(form.form, [...path, 'aggregateFieldId'] as any) as Writable<string>

	$: foreignTableId = $referenceFieldId
		? (schema.get($referenceFieldId) as ReferenceField | TreeField | undefined)?.foreignTableId.into() ??
		  $table.id.value
		: undefined
	let coreTable: Table | undefined
	$: if (foreignTableId) {
		$tableById(foreignTableId).then((t) => (coreTable = t))
	}
</script>

<div class="grid grid-cols-2 gap-2">
	<ReferenceFieldPicker
		bind:value={$referenceFieldId}
		required
		{...$$restProps}
		class={cn('w-full !justify-start', $$restProps.class)}
	/>
	{#if coreTable}
		<div class="space-y-2">
			<Label>
				<span>{$t('Display Fields') ?? undefined}</span>
			</Label>
			<FieldPicker
				table={coreTable}
				bind:value={$aggregateFieldId}
				{...$$restProps}
				class={cn('w-full !justify-start', $$restProps.class)}
				fields={$getForeignTableFieldsByReferenceId($referenceFieldId)}
				filter={(f) => isNumeric(f.type) && !isAggregate(f.type)}
			/>
		</div>
	{/if}
</div>
