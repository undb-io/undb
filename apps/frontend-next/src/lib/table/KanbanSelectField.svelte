<script lang="ts">
	import { getTable, getView } from '$lib/context'
	import { Card, Radio } from 'flowbite-svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { trpc } from '$lib/trpc/client'
	import { page } from '$app/stores'
	import { writable } from 'svelte/store'

	const table = getTable()
	const view = getView()
	$: kanbanFields = $table.schema.kanbanFields

	const kanbanField = writable($view.kanbanFieldIdString)
	const onChange = async () => {
		if (kanbanField) {
			await trpc($page).table.view.kanban.setField.mutate({
				tableId: $table.id.value,
				viewId: $view.id.value,
				field: $kanbanField,
			})
			$view.kanbanFieldIdString = $kanbanField
		}
	}
</script>

<div class="flex items-center justify-center h-screen w-full bg-gray-100">
	<Card class="flex-1">
		<form class="flex flex-col space-y-6" action="?/selectKanbanField">
			{#each kanbanFields as field}
				<Radio bind:group={$kanbanField} name="kanbanFieldId" value={field.id.value} on:change={onChange}>
					<FieldIcon type={field.type} />
					{field.name.value}</Radio
				>
			{/each}
		</form>
	</Card>
</div>
