<script lang="ts">
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import type { Field } from '@undb/core'
	import { Label } from 'flowbite-svelte'
	export let field: Field
</script>

<Label class="space-y-2" data-field-id={field.id.value}>
	<div class="flex gap-2 items-center">
		<FieldIcon size={14} type={field.type} />
		<span>{field.name.value}</span>
		{#if field.required}
			<span class="text-red-500">*</span>
		{/if}
	</div>
	<slot {field} fieldName={field.id.value} placeholder={field.description?.value ?? ''} />
</Label>
