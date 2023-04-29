<script lang="ts">
	import { updateTableOpen } from '$lib/store/modal'
	import { Button, Label, Modal, Input, Spinner, Toast } from 'flowbite-svelte'
	import type { Validation } from 'sveltekit-superforms'
	import { FieldId, createUpdateTableSchema, updateTableSchema } from '@undb/core'
	import { superForm } from 'sveltekit-superforms/client'
	import { trpc } from '$lib/trpc/client'
	import { slide } from 'svelte/transition'
	import { t } from '$lib/i18n'
	import { getTable } from '$lib/store/table'

	export let data: Validation<ReturnType<typeof createUpdateTableSchema>>
	let opened: Record<string, boolean> = {}

	const table = getTable()

	const addField = () => {
		const id = FieldId.createId()
		opened = { [id]: true }
	}

	const updateTable = trpc.table.update.mutation({
		async onSuccess(data, variables, context) {
			updateTableOpen.set(false)
		},
	})

	const superFrm = superForm(data, {
		id: 'updateTable',
		SPA: true,
		applyAction: false,
		resetForm: true,
		invalidateAll: true,
		clearOnSubmit: 'errors-and-message',
		dataType: 'json',
		taintedMessage: null,
		validators: createUpdateTableSchema($table),
		async onUpdate(event) {
			reset()
			$updateTable.mutate({ id: $table.id.value, ...event.form.data })
		},
	})

	const { form, errors, reset, constraints, enhance, delayed, submitting } = superFrm
</script>

<Modal
	title={$t('Update Table') ?? undefined}
	placement="top-center"
	class="static w-full rounded-sm"
	size="lg"
	bind:open={$updateTableOpen}
>
	<form id="updateTable" class="flex flex-col justify-between flex-1 gap-2" method="POST" use:enhance>
		<div>
			<div>
				<Label class="space-y-2">
					<span>
						<span>{$t('Name', { ns: 'common' })}</span>
						<span class="text-red-500">*</span>
					</span>
					<Input
						data-auto-focus
						id="name"
						name="name"
						type="text"
						label="name"
						bind:value={$form.name}
						data-invalid={$errors.name}
						required
						{...$constraints.name}
					/>
				</Label>

				<!-- {#if $form.schema?.length}
					<Accordion class="my-4">
						{#each $form.schema as field, i (field.id)}
							<CreateTableFieldAccordionItem bind:open={opened[field.id ?? '']} {superFrm} {i} {field} />
						{/each}
					</Accordion>
				{/if} -->
			</div>

			<!-- <Button color="light" outline class="w-full my-3" on:click={addField}>
				<i class="ti ti-plus text-sm mr-4" />
				{$t('Create New Field')}</Button
			> -->
		</div>
	</form>

	<svelte:fragment slot="footer">
		<div class="w-full flex justify-end gap-2">
			<Button color="alternative" on:click={() => updateTableOpen.set(false)}>{$t('Cancel', { ns: 'common' })}</Button>
			<Button class="gap-4" type="submit" form="updateTable" disabled={$submitting}>
				{#if $delayed}
					<Spinner size="5" />
				{/if}
				{$t('Update Table')}</Button
			>
		</div>
	</svelte:fragment>
</Modal>

{#if $updateTable.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$updateTable.error.message}
		</span>
	</Toast>
{/if}
