<script lang="ts">
	import { getTable } from '$lib/context'
	import { createFieldOpen } from '$lib/store'
	import { Button, Input, Label, Modal, Select, Spinner, Toggle, A, Popover, Badge, Textarea } from 'flowbite-svelte'
	import FieldIcon from './FieldIcon.svelte'
	import { FIELD_SELECT_ITEMS } from './types'
	import { page } from '$app/stores'
	import { superForm } from 'sveltekit-superforms/client'
	import { trpc } from '$lib/trpc/client'
	import { invalidateAll } from '$app/navigation'
	import CreateFieldComponent from './CreateFieldComponent/CreateFieldComponent.svelte'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
	import { IconEyeClosed, IconPlus } from '@tabler/icons-svelte'
	import { canDisplay } from '@undb/core'

	const table = getTable()

	$: createField = $page.data.createField

	const superFrm = superForm(createField, {
		id: 'createField',
		SPA: true,
		dataType: 'json',
		clearOnSubmit: 'errors-and-message',
		resetForm: true,
		async onUpdate(event) {
			await trpc($page).table.field.create.mutate({ tableId: $table.id.value, field: event.form.data as any })
			await invalidateAll()
			reset()
			createFieldOpen.set(false)
		},
	})

	const { form, enhance, delayed, reset, submitting } = superFrm

	$: showDescription = false
	$: if (!showDescription) {
		$form.description = ''
	}
	$: if (!canDisplay($form.type)) {
		$form.display = false
	}

	$: displayFields = $table.schema.displayFields
		.map((f) => f.name.value)
		.concat($form.display ? $form.name : undefined)
		.filter(Boolean)
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

				<div class="flex">
					<div
						class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600 !border-r-0"
					>
						<FieldIcon size={14} type={$form.type} />
					</div>
					<Select class="rounded-sm !rounded-l-none" items={FIELD_SELECT_ITEMS} bind:value={$form.type} required />
				</div>
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

				<Textarea class="rounded-sm" name="description" bind:value={$form.description} />
			</Label>
		{/if}

		<CreateFieldComponent type={$form.type} form={superFrm} />

		<SuperDebug data={$form} />

		<svelte:fragment slot="footer">
			<div class="w-full flex items-center justify-between">
				<div class="flex-1">
					<Button size="xs" color="alternative" class="space-x-1" on:click={() => (showDescription = !showDescription)}>
						{#if showDescription}
							<IconEyeClosed size={16} />
						{:else}
							<IconPlus size={16} />
						{/if}
						<span>{showDescription ? 'hide' : 'show'} description </span>
					</Button>
				</div>
				<div class="flex justify-end items-center gap-4">
					<div class="flex gap-2 items-center">
						<Toggle bind:checked={$form.required}>required</Toggle>
						{#if canDisplay($form.type)}
							<Toggle bind:checked={$form.display}>display</Toggle>
							{#if displayFields.length}
								<Popover class="w-64 text-sm font-light " title="display fields">
									<div class="flex gap-2">
										{#each displayFields as field}
											<Badge>{field}</Badge>
										{/each}
									</div>
								</Popover>
							{/if}
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
