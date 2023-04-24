<script lang="ts">
	import autoAnimate from '@formkit/auto-animate'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import FieldTypePicker from '$lib/field/FieldInputs/FieldTypePicker.svelte'
	import MutateFieldComponent from '$lib/field/MutateFieldComponent/MutateFieldComponent.svelte'
	import { IconCircleChevronUp, IconCircleChevronDown, IconEyeClosed, IconPlus } from '@tabler/icons-svelte'
	import { isControlledFieldType, canDisplay, type ICreateTableInput } from '@undb/core'
	import { AccordionItem, Label, Input, Toggle, Button, Textarea } from 'flowbite-svelte'
	import type { SuperForm } from 'sveltekit-superforms/client'

	export let open: boolean
	export let schema: ICreateTableInput['schema']
	export let field: ICreateTableInput['schema'][number]
	export let superFrm: SuperForm<any, any>
	export let i: number

	$: form = superFrm.form
	$: errors = superFrm.errors

	$: showDescription = false
	$: if (!showDescription) {
		$form.schema[i].description = ''
	}
</script>

<AccordionItem
	bind:open
	defaultClass="flex items-center justify-between w-full font-medium text-left group-first:rounded-t-xl !py-2"
>
	<span slot="header" class="text-sm">
		<div class="flex items-center text-sm gap-2">
			<FieldIcon size={14} type={field.type} />
			{field.name || `Field ${schema.findIndex((f) => f.id === field.id) + 1}`}
		</div>
	</span>

	<div slot="arrowup">
		<IconCircleChevronUp size={16} />
	</div>
	<div slot="arrowdown">
		<IconCircleChevronDown size={16} />
	</div>

	<div class="space-y-2" use:autoAnimate={{ duration: 100 }}>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<Label class="space-y-2">
					<span>Type</span>
					<FieldTypePicker class="w-full !justify-start" bind:value={$form.schema[i].type} />
				</Label>
			</div>
			<div>
				<Label class="space-y-2">
					<span>name</span>
					<Input
						type="text"
						placeholder={field.description ?? 'name'}
						required
						data-invalid={$errors.schema?.[i]}
						bind:value={$form.schema[i].name}
					/>
				</Label>
			</div>
		</div>

		{#if showDescription}
			<Label class="flex flex-col gap-2">
				<div class="flex gap-2 items-center">
					<span>description</span>
				</div>

				<Textarea class="rounded-sm" name="description" bind:value={$form.schema[i].description} />
			</Label>
		{/if}

		<MutateFieldComponent type={$form.schema[i].type} form={superFrm} isNew path={['schema', i]} />
	</div>

	<div class="flex justify-between mt-5">
		<div>
			<Button size="xs" color="alternative" class="space-x-1" on:click={() => (showDescription = !showDescription)}>
				{#if showDescription}
					<IconEyeClosed size={16} />
				{:else}
					<IconPlus size={16} />
				{/if}
				<span>{showDescription ? 'hide' : 'show'} description </span>
			</Button>
		</div>
		<div class="flex gap-4">
			{#if !isControlledFieldType($form.schema[i].type)}
				<Toggle bind:checked={$form.schema[i].required}>required</Toggle>
			{/if}
			{#if canDisplay($form.schema[i].type)}
				<Toggle bind:checked={$form.schema[i].display}>display</Toggle>
			{/if}
			<Button size="xs" color="light" on:click={() => (open = false)}>ok</Button>
		</div>
	</div>
</AccordionItem>
