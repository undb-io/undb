<script lang="ts">
	import { getTable } from '$lib/store/table'
	import { createFieldInitial, createFieldOpen } from '$lib/store/modal'
	import { Button, Input, Label, Modal, Spinner, Toggle, Popover, Badge, Textarea, Toast } from 'flowbite-svelte'
	import FieldIcon from './FieldIcon.svelte'
	import { superForm } from 'sveltekit-superforms/client'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import MutateFieldComponent from './MutateFieldComponent/MutateFieldComponent.svelte'
	import { canDisplay, isControlledFieldType } from '@undb/core'
	import type { Validation } from 'sveltekit-superforms/index'
	import FieldTypePicker from './FieldInputs/FieldTypePicker.svelte'
	import Portal from 'svelte-portal'
	import { slide } from 'svelte/transition'
	import { t } from '$lib/i18n'

	const table = getTable()

	export let data: Validation<any>

	const createField = trpc().table.field.create.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			createFieldOpen.set(false)
		},
	})

	const superFrm = superForm(data, {
		id: 'createField',
		SPA: true,
		dataType: 'json',
		clearOnSubmit: 'errors-and-message',
		invalidateAll: false,
		taintedMessage: null,
		resetForm: true,
		async onUpdate(event) {
			$createField.mutate({ tableId: $table.id.value, field: event.form.data as any })
		},
	})

	$: if ($createFieldInitial) {
		$form.type = $createFieldInitial.type
		$form.name = $createFieldInitial.name
	}

	const { form, enhance, delayed, submitting } = superFrm

	$: showDescription = false
	$: if (!showDescription) {
		$form.description = ''
	}
	$: if (!canDisplay($form.type)) {
		$form.display = false
	}

	$: displayFields = $table.schema.displayFields
		.map((f) => f.name.value)
		.concat($form.display ? $form.name || $t('unamed') : undefined)
		.filter(Boolean)
</script>

<Portal target="body">
	<Modal
		title={$t('Create New Field') ?? undefined}
		placement="top-center"
		class="static w-full rounded-sm"
		size="lg"
		backdropClasses="fixed inset-0 z-[49] bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
		bind:open={$createFieldOpen}
	>
		<form method="POST" id="createField" use:enhance>
			<div class="space-y-2">
				<div class="grid grid-cols-2 gap-x-3 gap-y-4">
					<Label class="flex flex-col gap-2">
						<div class="flex gap-2 items-center">
							<FieldIcon size={14} type={$form.type} />
							<span>{$t('Type', { ns: 'common' })}</span>
							<span class="text-red-500">*</span>
						</div>

						<FieldTypePicker bind:value={$form.type} class="w-full !justify-start" />
					</Label>

					<Label class="flex flex-col gap-2">
						<div class="flex gap-2 items-center">
							<span>{$t('Name', { ns: 'common' })}</span>
							<span class="text-red-500">*</span>
						</div>

						<Input name="name" required bind:value={$form.name} />
					</Label>
				</div>

				{#if showDescription}
					<Label class="flex flex-col gap-2">
						<div class="flex gap-2 items-center">
							<span>{$t('Description', { ns: 'common' })}</span>
						</div>

						<Textarea name="description" bind:value={$form.description} />
					</Label>
				{/if}

				<MutateFieldComponent type={$form.type} form={superFrm} isNew />
			</div>
		</form>

		<svelte:fragment slot="footer">
			<div class="w-full flex items-center justify-between">
				<div class="flex-1">
					<Button size="xs" color="alternative" class="space-x-1" on:click={() => (showDescription = !showDescription)}>
						{#if showDescription}
							<i class="ti ti-eye-closed text-[16px]" />
						{:else}
							<i class="ti ti-plus text-[16px]" />
						{/if}
						<span>{$t('Add Description')}</span>
					</Button>
				</div>
				<div class="flex justify-end items-center gap-4">
					<div class="flex gap-2 items-center">
						{#if !isControlledFieldType($form.type)}
							<Toggle class="whitespace-nowrap" size="small" bind:checked={$form.required}
								>{$t('Required', { ns: 'common' })}</Toggle
							>
						{/if}
						{#if canDisplay($form.type)}
							<Toggle class="whitespace-nowrap" size="small" bind:checked={$form.display}
								>{$t('Display', { ns: 'common' })}</Toggle
							>
							{#if displayFields.length}
								<Popover class="w-64 text-sm font-light " title={$t('Display Fields') ?? undefined}>
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
						<Button color="alternative" on:click={() => createFieldOpen.set(false)}
							>{$t('Cancel', { ns: 'common' })}</Button
						>
						<Button class="gap-4" type="submit" form="createField" disabled={$submitting}>
							{#if $delayed}
								<Spinner size="5" />
							{/if}
							{$t('Create New Field')}</Button
						>
					</div>
				</div>
			</div>
		</svelte:fragment>
	</Modal>
</Portal>

{#if $createField.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$createField.error.message}
		</span>
	</Toast>
{/if}
