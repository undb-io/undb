<script lang="ts">
	import { Label } from '$components/ui/label'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { me } from '$lib/store/me'
	import { getTable } from '$lib/store/table'
	import { ANONYMOUS_USER_ID, Record, type Field, type Form, type RecordCompositeSpecification } from '@undb/core'
	import { quintOut } from 'svelte/easing'
	import { fly } from 'svelte/transition'
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

	$: if (filter && formField) {
		spec = formField
			.getSpec(field.id.value, $me?.userId ?? ANONYMOUS_USER_ID, form.getOrderedField($table.schema))
			.into(null)
	}

	$: isMatch = spec ? spec.isSatisfiedBy(tempRecord) : true
</script>

{#if isMatch}
	<div
		class="grid grid-cols-5 gap-x-3 gap-y-4 items-center"
		transition:fly={{ duration: 300, x: 100, easing: quintOut }}
	>
		<div class="h-full inline-flex items-center gap-1">
			<Label class="leading-5" for={field.id.value}>
				<div class="inline-flex items-center gap-2" data-field-id={field.id.value}>
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
	</div>
{/if}
