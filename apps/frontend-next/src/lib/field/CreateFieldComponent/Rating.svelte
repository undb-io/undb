<script lang="ts">
	import { Label, NumberInput } from 'flowbite-svelte'
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import { RATING_MAX, RATING_MAX_DEFAULT } from '@undb/core'
	import { onMount } from 'svelte'

	export let form: SuperForm<UnwrapEffects<string>, unknown>

	const max = fieldProxy(form.form, 'max')

	onMount(() => {
		$max = RATING_MAX_DEFAULT as never
	})
</script>

<div>
	<Label class="space-y-2">
		<span>max</span>
		<NumberInput bind:value={$max} min={0} max={RATING_MAX} />
	</Label>
</div>
