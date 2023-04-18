<script lang="ts">
	import { getRecords, getTable } from '$lib/context'
	import KanbanLane from '$lib/kanban/KanbanLane.svelte'
	import { flip } from 'svelte/animate'
	import Option from '$lib/option/Option.svelte'
	import { dndzone } from 'svelte-dnd-action'
	import { groupBy } from 'lodash'
	import type { SelectField, SelectFieldValue } from '@undb/core'
	import { trpc } from '$lib/trpc/client'
	import { page } from '$app/stores'

	export let fieldId: string
	const flipDurationMs = 200

	const table = getTable()
	const records = getRecords()
	$: field = $table.schema.getFieldById(fieldId).into() as SelectField

	$: options = field.options.options
	$: items = options.map((option) => ({ id: option.key.value, name: option.name.value, option }))

	$: groupedRecords = groupBy($records, (record) => {
		const value = record.values.value.get(field.id.value) as SelectFieldValue | undefined

		if (!value?.id) return null
		return value.id
	})

	function handleDndConsiderColumns(e: any) {
		items = e.detail.items
	}
	async function handleDndFinalizeColumns(e: any) {
		items = e.detail.items

		const from = e.detail.info.id
		const toIndex = items.findIndex((i) => i.id === from)
		const to = options[toIndex]?.key.value
		if (to && to !== from) {
			await trpc($page).table.field.select.reorderOptions.mutate({
				tableId: $table.id.value,
				fieldId: field.id.value,
				from,
				to,
			})
		}
	}
</script>

<section
	class="flex gap-5 h-full w-full px-10 py-5 overflow-scroll"
	use:dndzone={{ items, flipDurationMs }}
	on:consider={handleDndConsiderColumns}
	on:finalize={handleDndFinalizeColumns}
>
	{#each items as item (item.id)}
		<div animate:flip={{ duration: flipDurationMs }}>
			<KanbanLane records={groupedRecords[item.option.key.value]}>
				<svelte:fragment slot="title">
					<Option option={item.option} />
				</svelte:fragment>
			</KanbanLane>
		</div>
	{/each}
</section>
