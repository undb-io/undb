<script lang="ts">
	import { Input, Label } from 'flowbite-svelte'
	import { fieldProxy, formFieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import FieldsPicker from '../FieldInputs/FieldsPicker.svelte'
	import { getTable } from '$lib/store/table'
	import type { Writable } from 'svelte/store'
	import { t } from '$lib/i18n'

	export let form: SuperForm<UnwrapEffects<string>, unknown>
	export let isNew = false
	export let path: any[] = []

	const parentFieldName = fieldProxy(form.form, [...path, 'parentFieldName'] as any) as Writable<string>

	const { value: displayFieldIds } = formFieldProxy(form, 'displayFieldIds')

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
			<FieldsPicker class="w-full !justify-start" table={$table} bind:group={$displayFieldIds} disabled={!table} />
		</div>
	</div>
</div>
