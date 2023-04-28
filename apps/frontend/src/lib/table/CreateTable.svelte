<script lang="ts">
	import { createTableOpen } from '$lib/store/modal'
	import { Accordion, Button, Label, Modal, Input, Spinner, Toast } from 'flowbite-svelte'
	import type { Validation } from 'sveltekit-superforms'
	import { FieldId, type createTableInput } from '@undb/core'
	import { superForm } from 'sveltekit-superforms/client'
	import CreateTableFieldAccordionItem from './CreateTableFieldAccordionItem.svelte'
	import { trpc } from '$lib/trpc/client'
	import { goto, invalidate } from '$app/navigation'
	import { slide } from 'svelte/transition'

	export let data: Validation<typeof createTableInput>
	let opened: Record<string, boolean> = {}

	const addField = () => {
		const id = FieldId.createId()
		$form.schema = [...$form.schema, { id, type: 'string', name: '' }]
		opened = { [id]: true }
	}

	const createTable = trpc.table.create.mutation({
		async onSuccess(data, variables, context) {
			await invalidate('tables')
			goto(`/t/${data.id}`)

			createTableOpen.set(false)
		},
	})

	const superFrm = superForm(data, {
		id: 'createTable',
		SPA: true,
		applyAction: false,
		resetForm: true,
		invalidateAll: false,
		clearOnSubmit: 'errors-and-message',
		dataType: 'json',
		taintedMessage: null,
		async onUpdate(event) {
			reset()
			$createTable.mutate(event.form.data)
		},
	})

	$: {
		$form.schema = []
	}

	const { form, errors, reset, constraints, enhance, delayed, submitting } = superFrm
</script>

<Modal
	title="Create New Table"
	placement="top-center"
	class="static w-full rounded-sm"
	size="lg"
	bind:open={$createTableOpen}
>
	<form
		id="createTable"
		class="flex flex-col justify-between flex-1 gap-2"
		method="POST"
		action="/?/createTable"
		use:enhance
	>
		<div>
			<div>
				<Label class="space-y-2">
					<span>
						<span>name</span>
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

				{#if $form.schema?.length}
					<Accordion class="my-4">
						{#each $form.schema as field, i (field.id)}
							<CreateTableFieldAccordionItem bind:open={opened[field.id ?? '']} {superFrm} {i} {field} />
						{/each}
					</Accordion>
				{/if}
			</div>

			<Button color="light" outline class="w-full my-3" on:click={addField}>
				<i class="ti ti-plus text-sm mr-4" />
				Add Field</Button
			>
		</div>
	</form>

	<svelte:fragment slot="footer">
		<div class="w-full flex justify-end gap-2">
			<Button color="alternative" on:click={() => createTableOpen.set(false)}>Discard</Button>
			<Button class="gap-4" type="submit" form="createTable" disabled={$submitting}>
				{#if $delayed}
					<Spinner size="5" />
				{/if}
				Create New Table</Button
			>
		</div>
	</svelte:fragment>
</Modal>

{#if $createTable.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$createTable.error.message}
		</span>
	</Toast>
{/if}
