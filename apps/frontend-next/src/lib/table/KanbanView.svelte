<script lang="ts">
	import { getRecords, getTable } from '$lib/context'
	import KanbanLane from '$lib/kanban/KanbanLane.svelte'
	import Option from '$lib/option/Option.svelte'
	import { groupBy } from 'lodash'
	import type { SelectField, SelectFieldValue } from '@undb/core'

	export let fieldId: string

	const table = getTable()
	const records = getRecords()
	$: field = $table.schema.getFieldById(fieldId).into() as SelectField

	$: options = field.options.options

	$: groupedRecords = groupBy($records, (record) => {
		const value = record.values.value.get(field.id.value) as SelectFieldValue | undefined

		if (!value?.id) return null
		return value.id
	})
</script>

<div class="h-full w-full px-10 py-5">
	<div class="flex gap-5">
		{#each options as option}
			<KanbanLane records={groupedRecords[option.key.value]}>
				<svelte:fragment slot="title">
					<Option {option} />
				</svelte:fragment>
			</KanbanLane>
		{/each}
	</div>
</div>
