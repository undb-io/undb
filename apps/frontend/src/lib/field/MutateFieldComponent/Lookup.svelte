<script lang="ts">
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms/index'
	import ReferenceFieldPicker from '../FieldInputs/ReferenceFieldPicker.svelte'
	import DisplayFieldsPicker from '../FieldInputs/DisplayFieldsPicker.svelte'
	import type { Writable } from 'svelte/store'
	import {
		getForeignTableFieldsByReferenceId,
		getForeignTableIdByReferenceId,
		getForeignTable,
		newTableSchema,
	} from '$lib/store/table'
	import { t } from '$lib/i18n'
	import { Label } from '$components/ui/label'

	export let path: any[] = []

	export let form: SuperForm<UnwrapEffects<string>, unknown>

	const referenceFieldId = fieldProxy(form.form, [...path, 'referenceFieldId'] as any) as Writable<string>
	const displayFieldIds = fieldProxy(form.form, [...path, 'displayFieldIds'] as any) as Writable<string[]>

	$: fields = $getForeignTableFieldsByReferenceId($referenceFieldId)
	$: foreignTableId = $getForeignTableIdByReferenceId($referenceFieldId)
	$: foreignTable = $getForeignTable(foreignTableId)
</script>

<div class="grid grid-cols-2 gap-2">
	<ReferenceFieldPicker bind:value={$referenceFieldId} {...$$restProps} class="w-full !justify-start" />
	<div class="space-y-2">
		<Label>
			<span>{$t('Display Fields') ?? undefined}</span>
		</Label>
		<DisplayFieldsPicker
			{fields}
			tableName={foreignTableId === $newTableSchema.tableId ? $newTableSchema.tableName : foreignTable?.name.value}
			bind:group={$displayFieldIds}
			{...$$restProps}
		/>
	</div>
</div>
