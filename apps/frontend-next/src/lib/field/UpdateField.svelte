<script lang="ts">
	import autoAnimate from '@formkit/auto-animate'
	import { getTable } from '$lib/context'
	import { updateFieldOpen } from '$lib/store/modal'
	import { Button, Input, Label, Modal, Spinner, Toggle, Popover, Badge, Textarea } from 'flowbite-svelte'
	import FieldIcon from './FieldIcon.svelte'
	import { page } from '$app/stores'
	import { superForm } from 'sveltekit-superforms/client'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import MutateFieldComponent from './MutateFieldComponent/MutateFieldComponent.svelte'
	import { IconEyeClosed, IconPlus } from '@tabler/icons-svelte'
	import { canDisplay, type Field } from '@undb/core'
	import type { Validation } from 'sveltekit-superforms/index'
	import FieldTypePicker from './FieldInputs/FieldTypePicker.svelte'

	const table = getTable()

	export let field: Field
	export let data: Validation<any>

	const superFrm = superForm(data, {
		id: 'updateField',
		SPA: true,
		dataType: 'json',
		clearOnSubmit: 'errors-and-message',
		invalidateAll: false,
		taintedMessage: null,
		resetForm: true,
		async onUpdate(event) {
			await trpc($page).table.field.update.mutate({
				tableId: $table.id.value,
				fieldId: field.id.value,
				field: event.form.data as any,
			})
			await invalidate(`table:${$table.id.value}`)
			updateFieldOpen.set(false)
		},
	})

	const { form, enhance, delayed, submitting } = superFrm

	$: {
		$form.type = field.type
		$form.name = field.name.value
		$form.id = field.id.value
		$form.description = field.description?.value
		$form.required = field.required
		$form.display = !!field.display

		if (field.type === 'tree' || field.type === 'parent' || field.type === 'reference' || field.type === 'lookup') {
			$form.displayFieldIds = field.displayFieldIds.map((id) => id.value)
		}
		if (field.type === 'reference') {
			$form.foreignTableId = field.foreignTableId.into(null)
		}
		if (field.type === 'count' || field.type === 'sum' || field.type === 'average') {
			$form.referenceFieldId = field.referenceFieldId.value
		}
		if (field.type === 'sum' || field.type === 'average') {
			$form.aggregateFieldId = field.aggregateFieldId.value
		}
		if (field.type === 'lookup') {
			$form.referenceFieldId = field.referenceFieldId.value
		}
		if (field.type === 'select') {
			$form.options = field.options.options.map((o) => o.toJSON())
		}

		if (
			field.type === 'date' ||
			field.type === 'date-range' ||
			field.type === 'created-at' ||
			field.type === 'updated-at'
		) {
			$form.format = field.formatString
		}

		if (field.type === 'rating') {
			$form.max = field.max
		}
	}

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

<Modal
	title="Update New Field"
	placement="top-center"
	class="static w-full rounded-sm"
	size="lg"
	bind:open={$updateFieldOpen}
>
	<form method="POST" id="updateField" use:enhance>
		<div class="space-y-2" use:autoAnimate={{ duration: 100 }}>
			<div class="grid grid-cols-2 gap-x-3 gap-y-4">
				<Label class="flex flex-col gap-2">
					<div class="flex gap-2 items-center">
						<FieldIcon size={14} type={$form.type} />
						<span>type</span>
						<span class="text-red-500">*</span>
					</div>

					<FieldTypePicker disabled bind:value={$form.type} class="w-full !justify-start" />
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

			<MutateFieldComponent type={$form.type} form={superFrm} />
		</div>
	</form>

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
					<Button color="alternative" on:click={() => updateFieldOpen.set(false)}>Discard</Button>
					<Button class="gap-4" type="submit" form="updateField" disabled={$submitting}>
						{#if $delayed}
							<Spinner size="5" />
						{/if}
						Update New Field</Button
					>
				</div>
			</div>
		</div>
	</svelte:fragment>
</Modal>
