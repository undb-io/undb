<script lang="ts">
	import { Label } from '$components/ui/label'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { me } from '$lib/store/me'
	import { createRecordForm, getTable } from '$lib/store/table'
	import type { Field, Record, RecordCompositeSpecification } from '@undb/core'
	import { quintOut } from 'svelte/easing'
	import { fly } from 'svelte/transition'

	const table = getTable()
	export let field: Field
	export let value: any
	export let record: Record

	let show = true

	$: if ($createRecordForm) {
		const formField = $createRecordForm.fields.value.get(field.id.value)

		const filter = formField?.filter

		let spec: RecordCompositeSpecification | null = null

		if (filter && formField) {
			spec = formField.getSpec(field.id.value, $me.userId, $createRecordForm.getOrderedField($table.schema)).into(null)
		}

		const isMatch = spec ? spec.isSatisfiedBy(record) : true
		show = isMatch
	}
</script>

{#if show}
	<div
		class="grid grid-cols-5 gap-x-3 gap-y-4 items-center"
		transition:fly={{ duration: 300, x: 100, easing: quintOut }}
	>
		<div class="h-full items-start gap-1 pt-2">
			<Label class="leading-5" for={field.id.value}>
				<div class="inline-flex items-center gap-2" data-field-id={field.id.value}>
					<FieldIcon type={field.type} size={16} />
					<span>
						{field.name.value}
					</span>
				</div>
				{#if field.required}
					<span class="text-red-500">*</span>
				{/if}
			</Label>
		</div>
		<div class="col-span-4">
			<CellInput class="w-full" {field} bind:value />
		</div>
	</div>
{/if}
