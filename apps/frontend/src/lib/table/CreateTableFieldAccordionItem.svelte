<script lang="ts">
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import FieldTypePicker from '$lib/field/FieldInputs/FieldTypePicker.svelte'
	import MutateFieldComponent from '$lib/field/MutateFieldComponent/MutateFieldComponent.svelte'
	import {
		isControlledFieldType,
		canDisplay,
		type ICreateTableInput,
		createTableInput,
		updateTableSchema,
	} from '@undb/core'
	import { Label, Input, Toggle, Button, Textarea, Dropdown, DropdownItem, Badge } from 'flowbite-svelte'
	import type { SuperForm } from 'sveltekit-superforms/client'
	import { t } from '$lib/i18n'
	import * as Accordion from '$lib/components/ui/accordion'

	export let field: ICreateTableInput['schema'][number]
	export let superFrm: SuperForm<typeof createTableInput | typeof updateTableSchema, string>
	export let i: number
	export let isNew = false

	$: form = superFrm.form
	$: errors = superFrm.errors

	$: showDescription = false
	$: if (!showDescription) {
		field.description = ''
	}

	function remove() {
		$form.schema = $form.schema?.filter((_, index) => index !== i) ?? []
	}

	$: if (!canDisplay(field.type)) {
		field.display = false
	}
</script>

<Accordion.Item value={field.id ?? ''}>
	<Accordion.Trigger type="button">
		<div class="w-full flex items-center justify-between text-sm gap-2">
			<div class="flex items-center gap-2">
				<FieldIcon size={14} type={field.type} />
				<span>
					{field.name || `${$t('Field')} ${($form.schema?.findIndex((f) => f.id === field.id) ?? 0) + 1}`}
				</span>

				{#if field.display}
					<Badge>{$t('Display Fields')}</Badge>
				{/if}
			</div>
			<div>
				<slot name="header" />
			</div>
		</div>
	</Accordion.Trigger>

	<Accordion.Content>
		<div class="space-y-2">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<Label class="space-y-2">
						<span>{$t('Type', { ns: 'common' })}</span>
						<FieldTypePicker disabled={!isNew} class="w-full !justify-start" bind:value={field.type} />
					</Label>
				</div>
				<div>
					<Label class="space-y-2">
						<span>{$t('Name', { ns: 'common' })}</span>
						<Input
							type="text"
							name={field.id}
							placeholder={field.description ?? 'name'}
							required
							data-invalid={$errors.schema?.[i]}
							bind:value={field.name}
						/>
					</Label>
				</div>
			</div>

			{#if showDescription}
				<Label class="flex flex-col gap-2">
					<div class="flex gap-2 items-center">
						<span>{$t('Description', { ns: 'common' })}</span>
					</div>

					<Textarea class="rounded-sm" name="description" bind:value={field.description} />
				</Label>
			{/if}

			<MutateFieldComponent type={field.type} form={superFrm} {isNew} path={['schema', i]} />
		</div>

		<div class="flex justify-between mt-5">
			<div>
				<Button size="xs" color="alternative" class="space-x-1" on:click={() => (showDescription = !showDescription)}>
					{#if showDescription}
						<i class="ti ti-eye-closed text-sm" />
					{:else}
						<i class="ti ti-plus text-sm" />
					{/if}
					<span>{$t('Add Description')}</span>
				</Button>
			</div>
			<div class="flex gap-4 items-center">
				{#if !isControlledFieldType(field.type)}
					<Toggle size="small" bind:checked={field.required}>{$t('Required', { ns: 'common' })}</Toggle>
				{/if}
				{#if canDisplay(field.type)}
					<Toggle size="small" bind:checked={field.display}>{$t('Display', { ns: 'common' })}</Toggle>
				{/if}
				<span role="button" class="hover:bg-gray-100 px-3 rounded-sm flex items-center justify-center w-7 h-7">
					<i class="ti ti-dots text-sm" />
				</span>
				<Dropdown style="z-index: 50;">
					<DropdownItem class="text-red-500 font-normal text-xs gap-2 flex items-center" on:click={remove}>
						<i class="ti ti-trash" />
						<span>
							{$t('Delete', { ns: 'common' })}
						</span>
					</DropdownItem>
				</Dropdown>
				<Button size="xs" color="light" on:click={() => {}}>{$t('Done', { ns: 'common' })}</Button>
			</div>
		</div>
	</Accordion.Content>
</Accordion.Item>
