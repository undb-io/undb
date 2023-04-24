<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import { getRecord, getTable, getView, isRecordOpen } from '$lib/store/table'
	import { createMutateRecordValuesSchema } from '@undb/core'
	import { Button, Label, Modal, Spinner } from 'flowbite-svelte'
	import { superForm } from 'sveltekit-superforms/client'
	import { writable } from 'svelte/store'
	import type { Validation } from 'sveltekit-superforms/index'
	import { trpc } from '$lib/trpc/client'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'

	const open = writable(false)

	$: if ($isRecordOpen) {
		open.set(true)
	}

	$: if (!$open) {
		goto($page.url.pathname)
	}

	const table = getTable()
	const view = getView()

	const record = getRecord()

	export let data: Validation<any>
	$: validators = createMutateRecordValuesSchema(fields ?? [])
	$: fields = $view.getOrderedFields($table.schema.nonSystemFields)

	const { form, enhance, constraints, delayed, reset, submitting } = superForm(data, {
		id: 'updateRecord',
		SPA: true,
		validators,
		dataType: 'json',
		// invalidateAll: false,
		// resetForm: true,
		delayMs: 100,
		// clearOnSubmit: 'errors-and-message',
		taintedMessage: null,
		async onUpdate(event) {
			await trpc($page).record.update.mutate({ tableId: $table.id.value, values: event.form.data })
			await invalidate(`records:${$table.id.value}`)
			reset()
			goto($page.url.pathname)
		},
	})

	$: values = $record?.valuesJSON
	$: if (values && $record) {
		for (const [fieldId, value] of Object.entries(values)) {
			$form[fieldId] = value
		}
	}
</script>

<Modal title="Update Record" class="w-full h-[70%]" size="lg" bind:open={$open}>
	<form id="updateRecord" class="space-y-5" method="POST" use:enhance>
		<div class="grid grid-cols-5 gap-x-3 gap-y-4 items-center">
			{#each fields as field}
				<div class="h-full items-start gap-1 pt-2">
					<Label class="leading-5" for={field.id.value}>
						<div class="inline-flex items-center gap-2">
							<FieldIcon type={field.type} size={16} />
							<span>
								{field.name.value}
							</span>
						</div>
						{#if field.required}
							<span class="text-red-500">*</span>
						{/if}
					</Label>
				</div>
				<div class="col-span-4">
					<CellInput id={field.id.value} {field} bind:value={$form[field.id.value]} {...$constraints[field.id.value]} />
				</div>
			{/each}
		</div>
	</form>

	<svelte:fragment slot="footer">
		<div class="w-full flex justify-end gap-2">
			<Button color="alternative" on:click={() => goto($page.url.pathname)}>Discard</Button>
			<Button class="gap-4" type="submit" form="updateRecord" disabled={$submitting}>
				{#if $delayed}
					<Spinner size="5" />
				{/if}
				Create New Record</Button
			>
		</div>
	</svelte:fragment>
</Modal>
