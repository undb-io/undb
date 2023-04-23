<script lang="ts">
	import { Label } from 'flowbite-svelte'
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import OptionsInput from '../FieldInputs/OptionsInput.svelte'

	export let form: SuperForm<UnwrapEffects<string>, unknown>

	const options = fieldProxy(form.form, 'options')
</script>

<div class="space-y-2">
	<Label class="space-y-2">
		<span>options</span>
	</Label>
	<OptionsInput bind:value={$options} />
</div>
