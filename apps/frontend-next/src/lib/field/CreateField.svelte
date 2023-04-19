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

	const table = getTable()

	$: createField = $page.data.createField
	$: console.log(createField)

	const { form, enhance } = superForm(createField, {
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
</script>

<Modal title="Create New Field" placement="top-center" class="w-full" size="md" bind:open={$createFieldOpen}>
	<form method="POST" use:enhance>
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

		<Hr class="my-5" />

		<Button class="w-full rounded-sm gap-4" type="submit">Create New Field</Button>
	</form>
</Modal>
