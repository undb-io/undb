<script lang="ts">
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms/index'
	import ReferenceFieldPicker from '../FieldInputs/ReferenceFieldPicker.svelte'
	import FieldsPicker from '../FieldInputs/FieldsPicker.svelte'
	import type { Writable } from 'svelte/store'
	import { getTable } from '$lib/store/table'
	import { TableFactory, type IQueryTable, type ReferenceField, type TreeField } from '@undb/core'
	import { page } from '$app/stores'
	import { Label } from 'flowbite-svelte'
	import { t } from '$lib/i18n'

	const table = getTable()
	export let path: any[] = []

	export let form: SuperForm<UnwrapEffects<string>, unknown>

	const referenceFieldId = fieldProxy(form.form, [...path, 'referenceFieldId'] as any) as Writable<string>
	const displayFieldIds = fieldProxy(form.form, [...path, 'displayFieldIds'] as any) as Writable<string[]>

	$: schema = $table.schema.toIdMap()

	$: foreignTableId = $referenceFieldId
		? (schema.get($referenceFieldId) as ReferenceField | TreeField | undefined)?.foreignTableId.into() ??
		  $table.id.value
		: undefined

	$: tables = ($page.data.tables ?? []) as IQueryTable[]
	$: foreignTable = tables.find((t) => t.id === foreignTableId)
	$: coreForeignTable = foreignTable ? TableFactory.fromQuery(foreignTable) : undefined
</script>

<div class="grid grid-cols-2 gap-2">
	<ReferenceFieldPicker bind:value={$referenceFieldId} {...$$restProps} class="w-full !justify-start" />
	{#if coreForeignTable}
		<div class="space-y-2">
			<Label>
				<span>{$t('Display Fields') ?? undefined}</span>
			</Label>
			<FieldsPicker
				table={coreForeignTable}
				bind:group={$displayFieldIds}
				{...$$restProps}
				filter={(f) => f.isPrimitive()}
			/>
		</div>
	{/if}
</div>
