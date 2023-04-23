<script lang="ts">
	import { Input, Label } from 'flowbite-svelte'
	import { fieldProxy, formFieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import FieldsPicker from '../FieldInputs/FieldsPicker.svelte'
	import { getTable } from '$lib/context'

	export let form: SuperForm<UnwrapEffects<string>, unknown>

	const parentFieldName = fieldProxy(form.form, 'parentFieldName')

	const { value: displayFieldIds } = formFieldProxy(form, 'displayFieldIds')

	const table = getTable()
</script>

<div class="grid grid-cols-2 gap-2">
	<div class="space-y-2	">
		<Label class="inline-flex items-center">
			<span>parent field name</span>
		</Label>
		<Input bind:value={$parentFieldName} name="parentFieldName" />
	</div>

	<div class="space-y-2">
		<Label class="inline-flex items-center gap-2">
			<span>display fields</span>
		</Label>
		<div>
			<FieldsPicker table={$table} bind:group={$displayFieldIds} disabled={!table} />
		</div>
	</div>
</div>
