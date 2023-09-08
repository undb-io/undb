<script lang="ts">
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import DisplayFieldsPicker from '../FieldInputs/DisplayFieldsPicker.svelte'
	import type { Writable } from 'svelte/store'
	import { t } from '$lib/i18n'
	import { allTableFields, getTable, newTableSchema } from '$lib/store/table'
	import { Label } from '$components/ui/label'
	import { Input } from '$components/ui/input'

	export let form: SuperForm<UnwrapEffects<string>, unknown>
	export let isNew = false
	export let path: any[] = []

	const parentFieldName = fieldProxy(form.form, [...path, 'parentFieldName'] as any) as Writable<string>
	const displayFieldIds = fieldProxy(form.form, [...path, 'displayFieldIds'] as any) as Writable<string[]>

	const table = getTable()
</script>

<div class="grid grid-cols-2 gap-2">
	{#if isNew}
		<div class="space-y-2">
			<Label class="inline-flex items-center">
				<span>{$t('Parent Field Name')}</span>
			</Label>
			<Input bind:value={$parentFieldName} name="parentFieldName" />
		</div>
	{/if}

	<div class="space-y-2">
		<Label class="inline-flex items-center gap-2">
			<span>{$t('Display Fields') ?? undefined}</span>
		</Label>
		<div>
			<DisplayFieldsPicker
				fields={$allTableFields}
				tableName={$newTableSchema.tableName === undefined ? $table.name.value : $newTableSchema.tableName}
				class="w-full !justify-start"
				bind:group={$displayFieldIds}
			/>
		</div>
	</div>
</div>
