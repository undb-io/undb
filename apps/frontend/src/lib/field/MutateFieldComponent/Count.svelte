<script lang="ts">
	import { cn } from '$lib/utils'
	import { fieldProxy, type SuperForm } from 'sveltekit-superforms/client'
	import type { UnwrapEffects } from 'sveltekit-superforms/index'
	import ReferenceFieldPicker from '../FieldInputs/ReferenceFieldPicker.svelte'
	import type { Writable } from 'svelte/store'

	export let form: SuperForm<UnwrapEffects<string>, unknown>
	export let path: any[] = []

	const referenceFieldId = fieldProxy(form.form, [...path, 'referenceFieldId'] as any) as Writable<string>
</script>

<div class="grid grid-cols-2 gap-x-3">
	<ReferenceFieldPicker
		bind:value={$referenceFieldId}
		required
		{...$$restProps}
		class={cn('w-full !justify-start', $$restProps.class)}
	/>
</div>
