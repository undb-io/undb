<script lang="ts">
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { selectedForm } from '$lib/store/drawer'
	import { getTable } from '$lib/store/table'
	import { Label } from 'flowbite-svelte'

	const table = getTable()
	$: notHiddenFields = $selectedForm?.getNotHiddenFields($table.schema.toIdMap()) ?? []
</script>

{#if $selectedForm}
	<div class="space-y-2">
		{#each notHiddenFields as field}
			<div class="space-y-2 px-5 py-3 hover:bg-sky-50 hover:border-blue-200 border box-border">
				<Label class="leading-5" for={field.id.value} data-field-id={field.id.value}>
					<div class="inline-flex items-center gap-2">
						<FieldIcon type={field.type} size={16} />
						<span>
							{field.name.value}
						</span>
					</div>
					{#if $selectedForm.fields.isRequired(field.id.value)}
						<span class="text-red-500">*</span>
					{/if}
				</Label>
				<CellInput class="w-full" {field} readonly />
			</div>
		{/each}
	</div>
{/if}
