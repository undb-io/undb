<script lang="ts">
	import { getTable, getView, q, recordHash } from '$lib/store/table'
	import { createFieldInitial, createFieldModal } from '$lib/store/modal'
	import { Badge } from '$lib/components/ui/badge'
	import { Label } from '$lib/components/ui/label'
	import { Input } from '$lib/components/ui/input'
	import { Button } from '$components/ui/button'
	import { Textarea } from '$lib/components/ui/textarea'
	import { Switch } from '$lib/components/ui/switch'
	import * as HoverCard from '$lib/components/ui/hover-card'

	import FieldIcon from './FieldIcon.svelte'
	import { superForm } from 'sveltekit-superforms/client'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import MutateFieldComponent from './MutateFieldComponent/MutateFieldComponent.svelte'
	import { canDisplay, isControlledFieldType } from '@undb/core'
	import type { Validation } from 'sveltekit-superforms/index'
	import FieldTypePicker from './FieldInputs/FieldTypePicker.svelte'
	import { t } from '$lib/i18n'
	import * as Dialog from '$lib/components/ui/dialog'
	import Toast from '$components/ui/toast/toast.svelte'

	const table = getTable()
	const view = getView()

	export let data: Validation<any>

	const records = trpc().record.list.query(
		{ tableId: $table.id.value, viewId: $view.id.value, q: $q },
		{ enabled: false, refetchOnMount: false, refetchOnWindowFocus: true, queryHash: $recordHash },
	)

	const createField = trpc().table.field.create.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			await $records.refetch()
			await $createFieldModal.callback?.()
			createFieldModal.close()
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
		for (const [key, value] of Object.entries($createFieldInitial)) {
			$form[key] = value
		}
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
		.concat($form.display ? $form.name || $t('unnamed') : undefined)
		.filter(Boolean)
</script>

<Dialog.Root bind:open={$createFieldModal.open}>
	<Dialog.Content class="!w-1/2 max-w-none">
		<Dialog.Header>
			<Dialog.Title>{$t('Create New Field') ?? undefined}</Dialog.Title>
		</Dialog.Header>

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

						<Textarea class="dark:!text-gray-200" name="description" bind:value={$form.description} />
					</Label>
				{/if}

				<MutateFieldComponent type={$form.type} form={superFrm} isNew class="w-full" />
			</div>
		</form>
		<Dialog.Footer>
			<div class="w-full flex items-center justify-between">
				<div class="flex-1">
					<Button size="sm" variant="secondary" class="space-x-1" on:click={() => (showDescription = !showDescription)}>
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
							<Label class="flex items-center justify-center gap-2">
								<Switch class="whitespace-nowrap" bind:checked={$form.required}></Switch>
								{$t('Required', { ns: 'common' })}
							</Label>
						{/if}
						{#if canDisplay($form.type)}
							<HoverCard.Root>
								<HoverCard.Trigger>
									<Label class="flex items-center justify-center gap-2">
										<Switch class="whitespace-nowrap" bind:checked={$form.display}></Switch>
										{$t('Display', { ns: 'common' })}
									</Label>
								</HoverCard.Trigger>
								{#if displayFields.length}
									<HoverCard.Content>
										<div class="flex gap-2">
											{#each displayFields as field}
												<Badge>{field}</Badge>
											{/each}
										</div>
									</HoverCard.Content>
								{/if}
							</HoverCard.Root>
						{/if}
					</div>
					<div class="space-x-2">
						<Button variant="secondary" on:click={createFieldModal.close}>{$t('Cancel', { ns: 'common' })}</Button>
						<Button class="gap-4" type="submit" form="createField" disabled={$submitting}>
							{#if $delayed}
								<i class="ti ti-rotate animate-spin"></i>
							{/if}
							{$t('Create New Field')}</Button
						>
					</div>
				</div>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

{#if $createField.error}
	<Toast class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$createField.error.message}
		</span>
	</Toast>
{/if}
