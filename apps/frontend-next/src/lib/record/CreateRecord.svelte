<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import { getTable, getView } from '$lib/context'
	import { createRecordOpen } from '$lib/store'
	import { trpc } from '$lib/trpc/client'
	import { createMutateRecordValuesSchema } from '@undb/core'
	import { Button, Hr, Label, Modal, Spinner } from 'flowbite-svelte'
	import { superForm } from 'sveltekit-superforms/client'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'

	const table = getTable()
	const view = getView()

	$: validators = createMutateRecordValuesSchema(fields ?? [])
	$: createRecord = $page.data.createRecord
	$: fields = $view.getOrderedFields($table.schema.nonSystemFields)

	const { form, enhance, constraints, delayed, reset } = superForm(createRecord, {
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

	$: if (!$createRecordOpen) {
		reset()
	}
</script>

<form class="space-y-5" method="POST" use:enhance>
	<Modal title="Create New Record" class="w-full h-[70%]" size="lg" bind:open={$createRecordOpen}>
		<div class="grid grid-cols-5 gap-x-3 gap-y-4 items-center">
			{#each fields as field}
				<Label class="h-full inline-flex items-center gap-1" for={field.id.value}>
					{field.name.value}
					{#if field.required}
						<span class="text-red-500">*</span>
					{/if}
				</Label>
				<div class="col-span-4">
					<CellInput id={field.id.value} {field} bind:value={$form[field.id.value]} {...$constraints[field.id.value]} />
				</div>
			{/each}
		</div>

		<svelte:fragment slot="footer">
			<div class="w-full flex justify-end gap-2">
				<Button color="alternative" on:click={() => createRecordOpen.set(false)}>Discard</Button>
				<Button class="gap-4" type="submit">
					{#if $delayed}
						<Spinner size="5" />
					{/if}
					Create New Record</Button
				>
			</div>
		</svelte:fragment>
	</Modal>
</form>
