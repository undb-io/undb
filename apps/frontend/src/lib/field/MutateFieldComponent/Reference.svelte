<script lang="ts">
	import { withPrevious } from 'svelte-previous'
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import { canDisplay } from '@undb/core'
	import DisplayFieldsPicker from '../FieldInputs/DisplayFieldsPicker.svelte'
	import TablePicker from '../FieldInputs/TablePicker.svelte'
	import { getForeignTableFields, getForeignTable, getTable } from '$lib/store/table'
	import type { Writable } from 'svelte/store'
	import { t } from '$lib/i18n'
	import { Label } from '$components/ui/label'
	import { Switch } from '$components/ui/switch'
	import * as Tooltip from '$lib/components/ui/tooltip'

	export let form: SuperForm<UnwrapEffects<string>, unknown>
	export let isNew = false
	export let path: any[] = []

	const foreignTableId = fieldProxy(form.form, [...path, 'foreignTableId'] as any) as Writable<string>
	const displayFieldIds = fieldProxy(form.form, [...path, 'displayFieldIds'] as any) as Writable<string[]>
	const bidirectional = fieldProxy(form.form, [...path, 'bidirectional'] as any) as Writable<boolean>

	const table = getTable()

	const [, previousForeignTableId] = withPrevious($foreignTableId)
	$: if (isNew && $foreignTableId && previousForeignTableId && $foreignTableId !== $previousForeignTableId) {
		$displayFieldIds = [] as never
	}

	$: foreignTable = $getForeignTable($foreignTableId)
	$: fields = $foreignTableId ? $getForeignTableFields($foreignTableId) : []
</script>

<div class="grid grid-cols-2 gap-2">
	<div class="space-y-2">
		<Label class="inline-flex items-center gap-2">
			<span>{$t('Foreign Table')}</span>
			<span class="text-red-500">*</span>
			{#if foreignTable}
				<a href={`/t/${foreignTable.id.value}`}>
					<Tooltip.Root>
						<Tooltip.Trigger>
							<i class="ti ti-external-link text-gray-500" />
						</Tooltip.Trigger>
						<Tooltip.Content>
							{$t('jump to table', { name: foreignTable.name.value })}
						</Tooltip.Content>
					</Tooltip.Root>
				</a>
			{/if}
		</Label>

		<TablePicker bind:value={$foreignTableId} name="foreignTableId" class="w-full !justify-start" />
	</div>
	{#if $foreignTableId}
		<div class="space-y-2">
			<Label class="inline-flex items-center gap-2">
				<span>{$t('Display Fields')}</span>
			</Label>
			<div class="flex gap-2">
				<DisplayFieldsPicker
					class="w-full !justify-start"
					{fields}
					tableName={foreignTable?.name.value}
					bind:group={$displayFieldIds}
					disabled={!$foreignTableId}
					filter={(f) => canDisplay(f.type)}
				/>
				{#if $table?.id.value !== $foreignTableId && isNew}
					<Label class="flex items-center gap-2 whitespace-nowrap">
						<Switch bind:checked={$bidirectional} class="whitespace-nowrap" />
						{$t('Bidirectional')}
					</Label>
				{/if}
			</div>
		</div>
	{/if}
</div>
