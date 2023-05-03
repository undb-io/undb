<script lang="ts">
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms/index'
	import ReferenceFieldPicker from '../FieldInputs/ReferenceFieldPicker.svelte'
	import { getTable } from '$lib/store/table'
	import { TableFactory, type IQueryTable, type ReferenceField, type TreeField } from '@undb/core'
	import { page } from '$app/stores'
	import { Label } from 'flowbite-svelte'
	import FieldPicker from '../FieldInputs/FieldPicker.svelte'
	import type { Writable } from 'svelte/store'
	import { t } from '$lib/i18n'

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
	$: tables = ($page.data.tables ?? []) as IQueryTable[]
	$: foreignTable = tables.find((t) => t.id === foreignTableId)

	$: coreTable = foreignTable ? TableFactory.fromQuery(foreignTable) : undefined
</script>

<div class="grid grid-cols-2 gap-2">
	<ReferenceFieldPicker class="w-full !justify-start" bind:value={$referenceFieldId} required {...$$restProps} />
	{#if coreTable}
		<div class="space-y-2">
			<Label>
				<span>{$t('Display Fields')}</span>
			</Label>
			<FieldPicker
				table={coreTable}
				bind:value={$aggregateFieldId}
				{...$$restProps}
				filter={(f) => f.isNumeric && !f.isAggregate}
			/>
		</div>
	{/if}
</div>
