<script lang="ts">
	import { getTable } from '$lib/context'
	import { createFieldOpen } from '$lib/store'
	import { Button, Input, Label, Modal, Select, Spinner, Toggle, A, Popover, Badge } from 'flowbite-svelte'
	import FieldIcon from './FieldIcon.svelte'
	import { FIELD_SELECT_ITEMS } from './types'
	import { page } from '$app/stores'
	import { superForm } from 'sveltekit-superforms/client'
	import { trpc } from '$lib/trpc/client'
	import { invalidateAll } from '$app/navigation'
	import CreateFieldComponent from './CreateFieldComponent/CreateFieldComponent.svelte'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
	import { IconPlus } from '@tabler/icons-svelte'

	const table = getTable()

	$: createField = $page.data.createField

	const superFrm = superForm(createField, {
		id: 'createField',
		SPA: true,
		dataType: 'json',
		clearOnSubmit: 'errors-and-message',
		async onUpdate(event) {
			await trpc($page).table.field.create.mutate({ tableId: $table.id.value, field: event.form.data as any })
			await invalidateAll()
			createFieldOpen.set(false)
		},
		onResult(event) {
			reset()
		},
	})

	const { form, enhance, delayed, reset, submitting } = superFrm

	$: showDescription = false
	$: if (!showDescription) {
		$form.description = ''
	}

	$: displayFields = $table.schema.displayFields.map((f) => f.name.value).concat($form.display ? $form.name : undefined)
</script>

<form method="POST" use:enhance>
	<Modal
		title="Create New Field"
		placement="top-center"
		class="w-full rounded-sm"
		size="lg"
		bind:open={$createFieldOpen}
	>
		<div class="grid grid-cols-2 gap-x-3 gap-y-4">
			<Label class="flex flex-col gap-2">
				<div class="flex gap-2 items-center">
					<FieldIcon size={14} type={$form.type} />
					<span>type</span>
					<span class="text-red-500">*</span>
				</div>

				<Select class="rounded-sm" items={FIELD_SELECT_ITEMS} bind:value={$form.type} required />
			</Label>

			<Label class="flex flex-col gap-2">
				<div class="flex gap-2 items-center">
					<span>name</span>
					<span class="text-red-500">*</span>
				</div>

				<Input class="rounded-sm" name="name" required bind:value={$form.name} />
			</Label>
		</div>

		{#if showDescription}
			<Label class="flex flex-col gap-2">
				<div class="flex gap-2 items-center">
					<span>description</span>
				</div>

				<Input class="rounded-sm" name="description" required bind:value={$form.description} />
			</Label>
		{/if}

		<CreateFieldComponent type={$form.type} form={superFrm} />

		<SuperDebug data={$form} />

		<svelte:fragment slot="footer">
			<div class="w-full flex items-center justify-between">
				<div class="flex-1">
					<Button size="xs" color="alternative" class="space-x-1" on:click={() => (showDescription = !showDescription)}>
						<IconPlus size={16} />
						<span>{showDescription ? 'hide' : 'show'} description </span>
					</Button>
				</div>
				<div class="flex justify-end items-center gap-4">
					<div class="flex gap-2 items-center">
						<Toggle bind:checked={$form.required}>required</Toggle>
						<Toggle bind:checked={$form.display}>display</Toggle>
						{#if $form.display}
							<Popover class="w-64 text-sm font-light " title="display fields">
								<div class="flex gap-2">
									{#each displayFields as field}
										<Badge>{field}</Badge>
									{/each}
								</div>
							</Popover>
						{/if}
					</div>
					<div class="space-x-2">
						<Button color="alternative" on:click={() => createFieldOpen.set(false)}>Discard</Button>
						<Button class="gap-4" type="submit" disabled={$submitting}>
							{#if $delayed}
								<Spinner size="5" />
							{/if}
							Create New Field</Button
						>
					</div>
				</div>
			</div>
		</svelte:fragment>
	</Modal>
</form>
