<script lang="ts">
	import { invalidate } from '$app/navigation'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { selectedForm } from '$lib/store/drawer'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { Label } from 'flowbite-svelte'
	import type { SortableEvent } from 'sortablejs'
	import Sortable from 'sortablejs'
	import { onMount } from 'svelte'

	const table = getTable()
	$: notHiddenFields = $selectedForm?.getNotHiddenFields($table.schema) ?? []

	const setFormFieldsVisibilityMutation = trpc().table.form.field.setVisibility.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const setFormFieldsVisibility = (fieldId: string) => {
		if (!$selectedForm) return
		$setFormFieldsVisibilityMutation.mutate({
			tableId: $table.id.value,
			formId: $selectedForm.id.value,
			visibility: { [fieldId]: true },
		})
	}

	const setFormFieldsOrder = trpc().table.form.field.setOrder.mutation({})

	let el: HTMLDivElement

	const onEnd = (event: SortableEvent) => {
		if (!$selectedForm) return

		const fields = [...el.querySelectorAll('.fields')] as HTMLElement[]
		const ids = fields.map((f) => f.dataset['fieldId']).filter(Boolean) as string[]

		$setFormFieldsOrder.mutate({
			tableId: $table.id.value,
			formId: $selectedForm.id.value,
			fieldsOrder: ids,
		})
	}

	onMount(async () => {
		Sortable.create(el, {
			animation: 200,
			direction: 'vertical',
			onEnd,
		})
	})
</script>

{#if $selectedForm}
	<div bind:this={el} class="space-y-2">
		{#each notHiddenFields as field}
			<div
				data-field-id={field.id.value}
				class="fields space-y-2 px-5 py-3 hover:bg-sky-50 hover:border-blue-200 border box-border rounded-md relative group"
			>
				<button
					class="absolute right-4 top-2 hidden group-hover:block"
					on:click={() => setFormFieldsVisibility(field.id.value)}
				>
					<i class="ti ti-eye-closed" />
				</button>
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
				<CellInput class="w-full" {field} />
			</div>
		{/each}
	</div>
{/if}
