<script lang="ts">
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { getTable } from '$lib/store/table'
	import {
		ANONYMOUS_USER_ID,
		convertFilterSpec,
		Record,
		type Field,
		type Form,
		type RecordCompositeSpecification,
	} from '@undb/core'
	import { Label } from 'flowbite-svelte'
	import type { SuperForm } from 'sveltekit-superforms/client'

	export let form: Form
	export let field: Field
	export let tempRecord: Record
	export let superFrm: SuperForm<any>

	const table = getTable()

	const { form: f, constraints } = superFrm

	$: required = form.fields.isRequired(field.id.value)
	$: formField = form.fields.value.get(field.id.value)

	$: filter = formField?.filter

	let spec: RecordCompositeSpecification | null = null

	$: if (filter && formField && form.fieldsOrder) {
		spec = formField.getSpec(field.id.value, ANONYMOUS_USER_ID, form.getOrderedField($table.schema)).into(null)
	}

	$: isMatch = spec ? spec.isSatisfiedBy(tempRecord) : true
</script>

{#if isMatch}
	<div class="h-full items-start gap-1 pt-2">
		<Label class="leading-5" for={field.id.value} data-field-id={field.id.value}>
			<div class="inline-flex items-center gap-2">
				<FieldIcon type={field.type} size={16} />
				<span>
					{field.name.value}
				</span>
			</div>
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</Label>
	</div>
	<div class="col-span-4">
		<CellInput class="w-full" {field} bind:value={$f[field.id.value]} {...$constraints[field.id.value]} />
	</div>
{/if}
