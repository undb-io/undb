<script lang="ts">
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms/index'
	import ReferenceFieldPicker from '../FieldInputs/ReferenceFieldPicker.svelte'

	export let form: SuperForm<UnwrapEffects<string>, unknown>

	const referenceFieldId = fieldProxy(form.form, 'referenceFieldId')
</script>

<ReferenceFieldPicker bind:value={$referenceFieldId} required {...$$restProps} />
