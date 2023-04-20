<script lang="ts">
	import { getTable } from '$lib/context'
	import { createFieldOpen } from '$lib/store'
	import { Button, Hr, Input, Label, Modal, Select } from 'flowbite-svelte'
	import FieldIcon from './FieldIcon.svelte'
	import { FIELD_SELECT_ITEMS } from './types'
	import { page } from '$app/stores'
	import { superForm } from 'sveltekit-superforms/client'
	import { trpc } from '$lib/trpc/client'
	import { invalidateAll } from '$app/navigation'
	import CreateFieldComponent from './CreateFieldComponent/CreateFieldComponent.svelte'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'

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
	})

	const { form, enhance } = superFrm
</script>

<form method="POST" use:enhance>
	<Modal
		title="Create New Field"
		placement="top-center"
		class="w-full rounded-sm"
		size="md"
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

		<CreateFieldComponent type={$form.type} form={superFrm} />

		<SuperDebug data={$form} />

		<svelte:fragment slot="footer">
			<div class="w-full flex justify-end gap-2">
				<Button color="alternative" on:click={() => createFieldOpen.set(false)}>Discard</Button>
				<Button class="gap-4" type="submit">Create New Field</Button>
			</div>
		</svelte:fragment>
	</Modal>
</form>
