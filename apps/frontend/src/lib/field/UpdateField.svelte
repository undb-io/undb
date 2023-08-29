<script lang="ts">
	import { getTable, getView, q, recordHash } from '$lib/store/table'
	import { Spinner, Popover, Toast } from 'flowbite-svelte'
	import { Label } from '$lib/components/ui/label'
	import { Switch } from '$lib/components/ui/switch'
	import { Input } from '$lib/components/ui/input'
	import { Button } from '$components/ui/button'
	import { Badge } from '$components/ui/badge'
	import { Textarea } from '$lib/components/ui/textarea'
	import FieldIcon from './FieldIcon.svelte'
	import { superForm } from 'sveltekit-superforms/client'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import MutateFieldComponent from './MutateFieldComponent/MutateFieldComponent.svelte'
	import {
		canChangeType,
		canDisplay,
		isControlledFieldType,
		changeFieldTypeStrategy,
		fieldTypeConvertMap,
		type Field,
		type IFieldType,
	} from '@undb/core'
	import type { Validation } from 'sveltekit-superforms/index'
	import FieldTypePicker from './FieldInputs/FieldTypePicker.svelte'
	import { slide } from 'svelte/transition'
	import { t } from '$lib/i18n'
	import { updateFieldModal } from '$lib/store/modal'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'
	import { onMount } from 'svelte'
	import { isEmpty, keys } from 'lodash-es'
	import { pick } from 'lodash-es'
	import * as Dialog from '$lib/components/ui/dialog'

	const table = getTable()
	const view = getView()

	export let field: Field
	export let data: Validation<any>

	$: records = trpc().record.list.query(
		{ tableId: $table.id.value, viewId: $view.id.value, q: $q },
		{ refetchOnMount: false, refetchOnWindowFocus: false, enabled: false, queryHash: $recordHash },
	)

	const updateField = trpc().table.field.update.mutation({
		async onSuccess(data, variables, context) {
			updateFieldModal.close()
			await invalidate(`table:${$table.id.value}`)
			await $records.refetch()
		},
	})

	const superFrm = superForm(data, {
		id: 'updateField',
		SPA: true,
		dataType: 'json',
		clearOnSubmit: 'errors-and-message',
		invalidateAll: false,
		taintedMessage: null,
		resetForm: true,
		multipleSubmits: 'prevent',
		async onUpdate(event) {
			const taintedKeys = keys($tainted)
			if (isEmpty(taintedKeys)) return
			const values = pick(event.form.data, taintedKeys.concat('type'))

			$updateField.mutate({
				tableId: $table.id.value,
				fieldId: field.id.value,
				field: values as any,
			})
		},
	})

	const { form, enhance, delayed, submitting, tainted } = superFrm

	// set initial values
	onMount(() => {
		$form = field.json
		$tainted = undefined
	})

	$: showDescription = false
	$: if (!showDescription && $form.description) {
		$form.description = ''
	}
	$: if (!canDisplay($form.type) && $form.display) {
		$form.display = false
	}

	$: displayFields = $table.schema.displayFields
		.map((f) => f.name.value)
		.concat($form.display ? $form.name : undefined)
		.filter(Boolean)

	$: isUpdatingType = field.type !== $form.type
	$: fieldConvertStrategy = isUpdatingType ? fieldTypeConvertMap?.[field.type]?.[$form.type as IFieldType] : undefined
</script>

<Dialog.Root bind:open={$updateFieldModal.open}>
	<Dialog.Content class="!w-3/4 max-w-none">
		<Dialog.Header>
			<Dialog.Title>
				{$t('Update Field') ?? undefined}
			</Dialog.Title>
		</Dialog.Header>

		<form method="POST" id="updateField" use:enhance>
			<div class="space-y-2">
				<div class="grid grid-cols-2 gap-x-3">
					<Label class="flex flex-col gap-2">
						<div class="flex gap-2 items-center h-6">
							<FieldIcon size={14} type={field.type} />
							<span>{$t('Type', { ns: 'common' })}</span>
							<span class="text-red-500">*</span>
							{#if isUpdatingType}
								<Badge color="yellow">{$t('updatingTypeTip', { type: $t(field.type), newType: $t($form.type) })}</Badge>
							{/if}
						</div>

						<FieldTypePicker
							disabled={!canChangeType(field.type)}
							bind:value={$form.type}
							class="w-full !justify-start"
							filter={(type) => !!changeFieldTypeStrategy(field.type)(type)}
						/>
					</Label>

					<Label class="flex flex-col gap-2">
						<div class="flex gap-2 items-center h-6">
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

				<MutateFieldComponent type={$form.type} form={superFrm} {isUpdatingType} {fieldConvertStrategy} />
			</div>
		</form>

		<!-- <SuperDebug data={$form} /> -->

		<Dialog.Footer>
			<div class="w-full flex items-center justify-between">
				<div class="flex-1">
					<Button
						size="sm"
						variant="secondary"
						type="button"
						class="space-x-1"
						on:click={() => (showDescription = !showDescription)}
					>
						{#if showDescription}
							<i class="ti ti-eye-closed text-sm" />
						{:else}
							<i class="ti ti-plus text-sm" />
						{/if}
						<span>{$t('Add Description')}</span>
					</Button>
				</div>
				<div class="flex justify-end items-center gap-4">
					<div class="flex gap-2 items-center">
						{#if !isControlledFieldType($form.type)}
							<Label class="flex items-center gap-2">
								<Switch bind:checked={$form.required}></Switch>
								<span>
									{$t('Required', { ns: 'common' })}
								</span>
							</Label>
						{/if}
						{#if canDisplay($form.type)}
							<Label class="flex items-center gap-2">
								<Switch bind:checked={$form.display}></Switch>
								<span>
									{$t('Display', { ns: 'common' })}
								</span>
							</Label>
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
						<Button variant="secondary" on:click={updateFieldModal.close}>{$t('Cancel', { ns: 'common' })}</Button>
						<Button class="gap-4" type="submit" form="updateField" disabled={$submitting}>
							{#if $delayed}
								<Spinner size="5" />
							{/if}
							{$t('Update Field')}
						</Button>
					</div>
				</div>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

{#if $updateField.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$updateField.error.message}
		</span>
	</Toast>
{/if}
