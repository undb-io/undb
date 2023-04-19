<script lang="ts">
	import { page } from '$app/stores'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import { getTable, getView } from '$lib/context'
	import { createRecordOpen } from '$lib/store'
	import { createMutateRecordValuesSchema } from '@undb/core'
	import { Button, Hr, Modal } from 'flowbite-svelte'
	import { superForm } from 'sveltekit-superforms/client'

	const table = getTable()
	const view = getView()

	$: validators = createMutateRecordValuesSchema(fields ?? [])
	$: createRecord = $page.data.createRecord
	$: fields = $view.getOrderedFields($table.schema.nonSystemFields)

	const { form, constraints } = superForm(createRecord, {
		validators,
	})
</script>

<Modal title="Create New Record" class="w-full" size="md" bind:open={$createRecordOpen}>
	<form method="POST" action={`/t/${$table.id.value}?/createRecord`}>
		<div class="grid grid-cols-2">
			{#each fields as field}
				<div>
					<CellInput {field} bind:value={$form[field.id.value]} {...$constraints[field.id.value]} />
				</div>
			{/each}
		</div>

		<Hr class="my-5" />

		<Button class="w-full rounded-sm" type="submit">Create New Record</Button>
	</form>
</Modal>
