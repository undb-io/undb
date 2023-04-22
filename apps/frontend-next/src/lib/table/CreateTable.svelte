<script lang="ts">
	import { createTableHidden } from '$lib/store/modal'
	import {
		Drawer,
		CloseButton,
		FloatingLabelInput,
		Accordion,
		AccordionItem,
		Button,
		Alert,
		Label,
		Select,
	} from 'flowbite-svelte'
	import type { Validation } from 'sveltekit-superforms'
	import { sineIn } from 'svelte/easing'
	import { FieldId, type ICreateTableInput, type createTableInput } from '@undb/core'
	import { superForm } from 'sveltekit-superforms/client'
	import Icon from '$lib/field/FieldIcon.svelte'
	import { FIELD_SELECT_ITEMS } from '$lib/field/types'
	import { IconPlus } from '@tabler/icons-svelte'

	export let form: Validation<typeof createTableInput>

	let schema: ICreateTableInput['schema'] = form?.data?.schema ?? []

	$: hasField = !!schema.length

	let opened: Record<string, boolean> = {}

	const addField = () => {
		const id = FieldId.createId()
		schema = [...schema, { id, type: 'string', name: '' }]
		opened = { [id]: true }
	}

	const {
		form: createTable,
		errors,
		constraints,
		enhance,
	} = superForm(form, {
		applyAction: true,
		resetForm: true,
		dataType: 'json',
		onResult(event) {
			createTableHidden.set(true)
		},
	})

	$: createTable.update((prev) => ({ ...prev, schema }))

	let transitionParams = {
		x: 320,
		duration: 200,
		easing: sineIn,
	}
</script>

<Drawer
	transitionType="fly"
	{transitionParams}
	bind:hidden={$createTableHidden}
	id="createTable"
	width={'w-[700px]'}
	placement="right"
	class="flex flex-col"
>
	<div class="flex items-center">
		<h5
			id="drawer-label"
			class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
		>
			<svg
				class="w-5 h-5 mr-2"
				aria-hidden="true"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
					clip-rule="evenodd"
				/></svg
			>Create New Table
		</h5>
		<CloseButton on:click={() => createTableHidden.set(true)} class="mb-4 dark:text-white" />
	</div>

	<form class="flex flex-col justify-between flex-1" method="POST" action="/?/createTable" use:enhance>
		<div>
			<div>
				<FloatingLabelInput
					data-auto-focus
					id="name"
					name="name"
					type="text"
					label="name"
					bind:value={$createTable.name}
					data-invalid={$errors.name}
					required
					{...$constraints.name}
				/>
				{#if $errors.name}
					<Alert>{$errors.name}</Alert>
				{/if}

				<Accordion class="my-4">
					{#each schema as field, i}
						<AccordionItem
							bind:open={opened[field.id ?? '']}
							defaultClass="flex items-center justify-between w-full font-medium text-left group-first:rounded-t-xl !py-4"
						>
							<span slot="header">
								<div class="flex items-center3 gap-2">
									<Icon type={field.type} />
									{field.name || `Field ${schema.findIndex((f) => f.id === field.id) + 1}`}
								</div>
							</span>

							<div class="grid grid-cols-2 gap-4">
								<div>
									<Label for={`schema.${i}.type`} class="sr-only">Type</Label>
									<Select
										id="select-underline"
										underline
										items={FIELD_SELECT_ITEMS}
										data-invalid={$errors.schema?.[i]}
										bind:value={schema[i].type}
									/>
								</div>
								<div>
									<FloatingLabelInput
										type="text"
										label="name"
										id={`schema.${i}.type`}
										placeholder={field.description ?? 'text'}
										required
										data-invalid={$errors.schema?.[i]}
										bind:value={schema[i].name}
									/>
								</div>
							</div>
						</AccordionItem>
					{/each}
				</Accordion>
			</div>

			<Button color="yellow" outline class="w-full my-3" on:click={addField}>
				<IconPlus class="mr-4" size={16} />
				Add Field</Button
			>
		</div>
		<Button class="w-full" type="submit">Create New Table</Button>
	</form>
</Drawer>
