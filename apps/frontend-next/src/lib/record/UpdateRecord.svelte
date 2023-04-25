<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import { currentRecordId, getRecord, getTable, getView } from '$lib/store/table'
	import { Record, createMutateRecordValuesSchema } from '@undb/core'
	import { Button, Label, Modal, Spinner } from 'flowbite-svelte'
	import { superForm } from 'sveltekit-superforms/client'
	import { writable } from 'svelte/store'
	import type { Validation } from 'sveltekit-superforms/index'
	import { trpc } from '$lib/trpc/client'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { pick } from 'lodash'
	import { keys } from 'lodash'

	const table = getTable()
	const view = getView()
	const record = getRecord()

	export let data: Validation<any>

	$: validators = createMutateRecordValuesSchema(fields ?? [])
	$: fields = $view.getOrderedFields($table.schema.nonSystemFields)

	const superFrm = superForm(data, {
		id: 'updateRecord',
		SPA: true,
		applyAction: true,
		validators,
		dataType: 'json',
		invalidateAll: false,
		resetForm: true,
		clearOnSubmit: 'errors-and-message',
		taintedMessage: null,
		delayMs: 100,
		async onUpdate(event) {
			if (!$record) return
			const taintedKeys = keys($tainted)
			const values = pick(event.form.data, taintedKeys)
			await trpc($page).record.update.mutate({
				tableId: $table.id.value,
				id: $record.id.value,
				values,
			})
			await invalidate(`records:${$table.id.value}`)
			currentRecordId.set(undefined)
		},
	})

	const { form, enhance, delayed, tainted, submitting } = superFrm

	const open = writable<boolean>(false)
	$: {
		open.set(!!$currentRecordId)
	}
	$: if (!$open) {
		currentRecordId.set(undefined)
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
					<CellInput {field} bind:value={$form[field.id.value]} />
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
				Update Record</Button
			>
		</div>
	</svelte:fragment>
</Modal>
