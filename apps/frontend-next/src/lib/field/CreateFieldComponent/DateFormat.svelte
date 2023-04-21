<script lang="ts">
	import { Label, NumberInput, Select } from 'flowbite-svelte'
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms'
	import { BUILT_IN_DATE_FORMATS, DEFAULT_DATE_FORMAT, RATING_MAX, RATING_MAX_DEFAULT } from '@undb/core'
	import { onMount } from 'svelte'
	import type { Writable } from 'svelte/store'

	export let form: SuperForm<UnwrapEffects<string>, unknown>

	const format = fieldProxy(form.form, 'format') as Writable<string>

	onMount(() => {
		$format = DEFAULT_DATE_FORMAT
	})

	const items = BUILT_IN_DATE_FORMATS.map((format) => ({ value: format, name: format }))
</script>

<div>
	<Label class="space-y-2">
		<span>max</span>
		<Select bind:value={$format} {items} />
	</Label>
</div>
