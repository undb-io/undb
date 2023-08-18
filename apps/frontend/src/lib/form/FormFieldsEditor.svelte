<script lang="ts">
	import { selectedForm } from '$lib/store/drawer'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { SortableEvent } from 'sortablejs'
	import Sortable from 'sortablejs'
	import { onMount } from 'svelte'
	import FormFieldEditorItem from './FormFieldEditorItem.svelte'

	const table = getTable()
	$: notHiddenFields = $selectedForm?.getNotHiddenFields($table.schema) ?? []

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
		{#each notHiddenFields as field (field.id.value)}
			<FormFieldEditorItem {field} />
		{/each}
	</div>
{/if}
