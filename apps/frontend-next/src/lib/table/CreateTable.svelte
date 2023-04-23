<script lang="ts">
	import { createTableOpen } from '$lib/store/modal'
	import {
		FloatingLabelInput,
		Accordion,
		AccordionItem,
		Button,
		Alert,
		Label,
		Modal,
		Input,
		Spinner,
	} from 'flowbite-svelte'
	import type { Validation } from 'sveltekit-superforms'
	import { FieldId, type ICreateTableInput, type createTableInput } from '@undb/core'
	import { superForm } from 'sveltekit-superforms/client'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { IconPlus } from '@tabler/icons-svelte'
	import FieldTypePicker from '$lib/field/FieldInputs/FieldTypePicker.svelte'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
	import MutateFieldComponent from '$lib/field/MutateFieldComponent/MutateFieldComponent.svelte'

	export let data: Validation<typeof createTableInput>
	let schema: ICreateTableInput['schema'] = data?.data?.schema ?? []
	let opened: Record<string, boolean> = {}

	const addField = () => {
		const id = FieldId.createId()
		schema = [...schema, { id, type: 'string', name: '' }]
		opened = { [id]: true }
	}

	const superFrm = superForm(data, {
		applyAction: true,
		resetForm: true,
		invalidateAll: true,
		clearOnSubmit: 'errors-and-message',
		dataType: 'json',
		taintedMessage: null,
		onResult(event) {
			reset()
			schema = []
			createTableOpen.set(false)
		},
	})

	const { form, errors, reset, constraints, enhance, delayed, submitting } = superFrm

	$: form.update((prev) => ({ ...prev, schema }))
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
				{#if $errors.name}
					<Alert>{$errors.name}</Alert>
				{/if}

				<Accordion class="my-4 space-y-2">
					{#each schema as field, i}
						<AccordionItem
							bind:open={opened[field.id ?? '']}
							defaultClass="flex items-center justify-between w-full font-medium text-left group-first:rounded-t-xl !py-2"
						>
							<span slot="header">
								<div class="flex items-center text-sm gap-2">
									<FieldIcon size={16} type={field.type} />
									{field.name || `Field ${schema.findIndex((f) => f.id === field.id) + 1}`}
								</div>
							</span>

							<div class="space-y-2">
								<div class="grid grid-cols-2 gap-4">
									<div>
										<Label class="space-y-2">
											<span>Type</span>
											<FieldTypePicker class="w-full !justify-start" bind:value={$form.schema[i].type} />
										</Label>
									</div>
									<div>
										<Label class="space-y-2">
											<span>name</span>
											<Input
												type="text"
												placeholder={field.description ?? 'name'}
												required
												data-invalid={$errors.schema?.[i]}
												bind:value={$form.schema[i].name}
											/>
										</Label>
									</div>
								</div>
								<MutateFieldComponent type={$form.schema[i].type} form={superFrm} isNew path={['schema', i]} />
							</div>
						</AccordionItem>
					{/each}
				</Accordion>
			</div>

			<Button color="light" outline class="w-full my-3" on:click={addField}>
				<IconPlus class="mr-4" size={16} />
				Add Field</Button
			>
		</div>
	</form>

	<SuperDebug data={$form} />

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
