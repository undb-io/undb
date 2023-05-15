<script lang="ts">
	import { page } from '$app/stores'
	import { Label, Toggle } from 'flowbite-svelte'
	import { withPrevious } from 'svelte-previous'
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import { TableFactory, type IQueryTable, canDisplay } from '@undb/core'
	import FieldsPicker from '../FieldInputs/FieldsPicker.svelte'
	import TablePicker from '../FieldInputs/TablePicker.svelte'
	import { getTable } from '$lib/store/table'
	import type { Writable } from 'svelte/store'
	import { t } from '$lib/i18n'

	export let form: SuperForm<UnwrapEffects<string>, unknown>
	export let isNew = false
	export let path: any[] = []

	const foreignTableId = fieldProxy(form.form, [...path, 'foreignTableId'] as any) as Writable<string>
	const displayFieldIds = fieldProxy(form.form, [...path, 'displayFieldIds'] as any) as Writable<string[]>
	const bidirectional = fieldProxy(form.form, [...path, 'bidirectional'] as any) as Writable<boolean>

	const table = getTable()
	$: tables = $page.data.tables as IQueryTable[]
	$: foreignTable = tables.find((table) => table.id === $foreignTableId)
	$: coreForeignTable = foreignTable ? TableFactory.fromQuery(foreignTable) : undefined

	const [, previousForeignTableId] = withPrevious($foreignTableId)
	$: if (isNew && $foreignTableId && previousForeignTableId && $foreignTableId !== $previousForeignTableId) {
		$displayFieldIds = [] as never
	}
</script>

<div class="grid grid-cols-2 gap-2">
	<div class="space-y-2">
		<Label class="inline-flex items-center gap-2">
			<span>{$t('Foreign Table')}</span>
			<span class="text-red-500">*</span>
		</Label>

		<TablePicker disabled={!isNew} bind:value={$foreignTableId} name="foreignTableId" class="w-full !justify-start" />
	</div>
	{#if coreForeignTable}
		<div class="space-y-2">
			<Label class="inline-flex items-center gap-2">
				<span>{$t('Display Fields')}</span>
			</Label>
			<div class="flex gap-2">
				<FieldsPicker
					class="w-full !justify-start"
					table={coreForeignTable}
					bind:group={$displayFieldIds}
					disabled={!foreignTable}
					filter={(f) => canDisplay(f.type)}
				/>
				{#if $table?.id.value !== $foreignTableId && isNew}
					<Toggle size="small" bind:checked={$bidirectional} class="whitespace-nowrap">{$t('Bidirectional')}</Toggle>
				{/if}
			</div>
		</div>
	{/if}
</div>
