<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { Button, Hr, Radio } from 'flowbite-svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { trpc } from '$lib/trpc/client'
	import { writable } from 'svelte/store'
	import { createFieldInitial, createFieldOpen } from '$lib/store/modal'

	const table = getTable()
	const view = getView()
	$: kanbanFields = $table.schema.kanbanFields

	const kanbanField = writable($view.kanbanFieldIdString)
	const setField = trpc.table.view.kanban.setField.mutation({
		onSuccess(data, variables, context) {
			$view.kanbanFieldIdString = $kanbanField
		},
	})
	const onChange = async () => {
		if (kanbanField) {
			$setField.mutate({
				tableId: $table.id.value,
				viewId: $view.id.value,
				field: $kanbanField,
			})
		}
	}
</script>

<div class="flex flex-col space-y-2">
	{#each kanbanFields as field}
		<Radio bind:group={$kanbanField} name="kanbanFieldId" value={field.id.value} on:change={onChange} class="space-x-1">
			<FieldIcon type={field.type} />
			<span>{field.name.value}</span>
		</Radio>
	{/each}
</div>

{#if kanbanFields.length}
	<Hr class="my-6">
		<span class="text-gray-400 text-sm font-normal">or</span></Hr
	>
{/if}

<div class="flex justify-center">
	<Button
		size="xs"
		color="light"
		class="inline-flex gap-2"
		on:click={() => {
			$createFieldInitial = {
				type: 'select',
			}
			$createFieldOpen = true
		}}
	>
		<i class="ti ti-plus" />
		<span>create new select field</span>
		<FieldIcon type="select" />
	</Button>
</div>
