<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import { getTable, getView } from '$lib/context'
	import { createRecordOpen } from '$lib/store'
	import { trpc } from '$lib/trpc/client'
	import { createFieldSchema, createMutateRecordValuesSchema } from '@undb/core'
	import { Button, Hr, Modal, Spinner } from 'flowbite-svelte'
	import { superForm } from 'sveltekit-superforms/client'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'

	const table = getTable()
	const view = getView()

	$: validators = createMutateRecordValuesSchema(fields ?? [])
	$: createRecord = $page.data.createRecord
	$: fields = $view.getOrderedFields($table.schema.nonSystemFields)

	const { form, enhance, constraints, delayed } = superForm(createRecord, {
		id: 'createRecord',
		SPA: true,
		validators,
		dataType: 'json',
		delayMs: 100,
		clearOnSubmit: 'errors-and-message',
		async onUpdate(event) {
			await trpc($page).record.create.mutate({ tableId: $table.id.value, values: event.form.data })
			invalidate(`records:${$table.id.value}`)
		},
		onResult() {
			createRecordOpen.set(false)
		},
	})
</script>

<Modal title="Create New Record" class="w-full" size="md" bind:open={$createRecordOpen}>
	<form method="POST" use:enhance>
		<div class="grid grid-cols-2 gap-x-3 gap-y-4">
			{#each fields as field}
				<div>
					<CellInput {field} bind:value={$form[field.id.value]} {...$constraints[field.id.value]} />
				</div>
			{/each}
		</div>

		<Hr class="my-5" />

		<Button class="w-full rounded-sm gap-4" type="submit">
			{#if $delayed}
				<Spinner size="5" />
			{/if}
			Create New Record</Button
		>
	</form>

	<SuperDebug data={$form} />
</Modal>
