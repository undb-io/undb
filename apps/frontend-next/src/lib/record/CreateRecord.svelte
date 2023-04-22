<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import { getTable, getView } from '$lib/context'
	import { createRecordOpen } from '$lib/store/modal'
	import { trpc } from '$lib/trpc/client'
	import { createMutateRecordValuesSchema } from '@undb/core'
	import { Button, Label, Modal, Spinner } from 'flowbite-svelte'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'

	const table = getTable()
	const view = getView()

	export let data: Validation<any>
	$: validators = createMutateRecordValuesSchema(fields ?? [])
	$: fields = $view.getOrderedFields($table.schema.nonSystemFields)

	const { form, enhance, constraints, delayed, reset, submitting } = superForm(data, {
		id: 'createRecord',
		SPA: true,
		validators,
		dataType: 'json',
		invalidateAll: false,
		resetForm: true,
		delayMs: 100,
		clearOnSubmit: 'errors-and-message',
		taintedMessage: null,
		async onUpdate(event) {
			await trpc($page).record.create.mutate({ tableId: $table.id.value, values: event.form.data })
			await invalidate(`records:${$table.id.value}`)
			reset()
			createRecordOpen.set(false)
		},
	})

	$: $table, reset()
</script>

<Modal title="Create New Record" class="w-full h-[70%]" size="lg" bind:open={$createRecordOpen}>
	<form id="createRecord" class="space-y-5" method="POST" use:enhance>
		<div class="grid grid-cols-5 gap-x-3 gap-y-4 items-center">
			{#each fields as field}
				<Label class="h-full inline-flex items-start gap-1" for={field.id.value}>
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
	</form>

	<svelte:fragment slot="footer">
		<div class="w-full flex justify-end gap-2">
			<Button color="alternative" on:click={() => createRecordOpen.set(false)}>Discard</Button>
			<Button class="gap-4" type="submit" form="createRecord" disabled={$submitting}>
				{#if $delayed}
					<Spinner size="5" />
				{/if}
				Create New Record</Button
			>
		</div>
	</svelte:fragment>
</Modal>
