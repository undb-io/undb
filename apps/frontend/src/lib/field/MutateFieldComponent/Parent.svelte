<script lang="ts">
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import DisplayFieldsPicker from '../FieldInputs/DisplayFieldsPicker.svelte'
	import { allTableFields, getTable, newTableSchema } from '$lib/store/table'
	import type { Writable } from 'svelte/store'
	import { t } from '$lib/i18n'
	import { Label } from '$components/ui/label'

	export let form: SuperForm<UnwrapEffects<string>, unknown>
	export let isNew = false
	export let path: any[] = []

	const displayFieldIds = fieldProxy(form.form, [...path, 'displayFieldIds'] as any) as Writable<string[]>

	const table = getTable()
</script>

{#if !isNew}
	<div class="grid grid-cols-2 gap-2">
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
					disabled={!table}
				/>
			</div>
		</div>
	</div>
{/if}
