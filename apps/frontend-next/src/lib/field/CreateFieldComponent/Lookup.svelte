<script lang="ts">
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms/index'
	import ReferenceFieldPicker from '../Inputs/ReferenceFieldPicker.svelte'
	import DisplayFieldsPicker from '../Inputs/DisplayFieldsPicker.svelte'
	import type { Writable } from 'svelte/store'
	import { getTable } from '$lib/context'
	import type { IQueryTable, ReferenceField, TreeField } from '@undb/core'
	import { page } from '$app/stores'
	import { Label } from 'flowbite-svelte'
	$: console.log($page)

	const table = getTable()

	export let form: SuperForm<UnwrapEffects<string>, unknown>

	const referenceFieldId = fieldProxy(form.form, 'referenceFieldId')
	const displayFieldIds = fieldProxy(form.form, 'displayFieldIds') as Writable<string[]>

	$: schema = $table.schema.toIdMap()

	$: foreignTableId = $referenceFieldId
		? (schema.get($referenceFieldId) as ReferenceField | TreeField | undefined)?.foreignTableId.into() ??
		  $table.id.value
		: undefined

	$: tables = ($page.data.tables ?? []) as IQueryTable[]
	$: foreignTable = tables.find((t) => t.id === foreignTableId)
</script>

<div class="grid grid-cols-2 gap-2">
	<ReferenceFieldPicker bind:value={$referenceFieldId} {...$$restProps} />
	{#if foreignTable}
		<div class="space-y-2">
			<Label>
				<span>display fields</span>
			</Label>
			<DisplayFieldsPicker table={foreignTable} bind:group={$displayFieldIds} {...$$restProps} />
		</div>
	{/if}
</div>
