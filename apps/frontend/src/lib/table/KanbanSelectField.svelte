<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { Button, Card, Hr, Radio } from 'flowbite-svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { trpc } from '$lib/trpc/client'
	import { page } from '$app/stores'
	import { writable } from 'svelte/store'
	import { createFieldInitial, createFieldOpen } from '$lib/store/modal'

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
		<div class="flex flex-col space-y-6 space-x-2">
			{#each kanbanFields as field}
				<Radio
					bind:group={$kanbanField}
					name="kanbanFieldId"
					value={field.id.value}
					on:change={onChange}
					class="space-x-1"
				>
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

		<Button
			size="xs"
			color="light"
			on:click={() => {
				$createFieldInitial = {
					type: 'select',
				}
				$createFieldOpen = true
			}}>create new select field</Button
		>
	</Card>
</div>
