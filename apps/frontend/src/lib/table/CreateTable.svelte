<script lang="ts">
	import { Accordion, Button, Label, Modal, Input, Spinner, Toast, P, Badge } from 'flowbite-svelte'
	import type { Validation } from 'sveltekit-superforms'
	import { FieldId, TableId, type createTableInput } from '@undb/core'
	import { superForm } from 'sveltekit-superforms/client'
	import CreateTableFieldAccordionItem from './CreateTableFieldAccordionItem.svelte'
	import { trpc } from '$lib/trpc/client'
	import { goto, invalidate } from '$app/navigation'
	import { slide } from 'svelte/transition'
	import { t } from '$lib/i18n'
	import { createTableModal } from '$lib/store/modal'
	import { newTableSchema } from '$lib/store/table'
	import { onDestroy } from 'svelte'
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte'

	export let data: Validation<typeof createTableInput>
	let opened: Record<string, boolean> = {}

	const addField = () => {
		const id = FieldId.createId()
		$form.schema = [...($form.schema ?? []), { id, type: 'string', name: '', display: !displayFields?.length }]
		opened = { [id]: true }
	}

	$: if (!$form.schema?.length) {
		addField()
	}

	const createTable = trpc().table.create.mutation({
		async onSuccess(data, variables, context) {
			createTableModal.close()
			await invalidate('tables')
			await goto(`/t/${data.id}`)
			reset()
		},
	})

	const superFrm = superForm(data, {
		id: 'createTable',
		SPA: true,
		applyAction: false,
		resetForm: false,
		invalidateAll: true,
		clearOnSubmit: 'errors-and-message',
		dataType: 'json',
		taintedMessage: null,
		async onUpdate(event) {
			$createTable.mutate(event.form.data)
		},
	})

	const { form, errors, reset, constraints, enhance, delayed, submitting } = superFrm

	$: $form.id = TableId.createId()
	$: $form.schema = []
	$: displayFields = $form.schema?.filter((f) => !!f.display) ?? []

	$: newTableSchema.set({
		tableId: $form.id,
		tableName: $form.name,
		schema: $form.schema,
	})

	onDestroy(() => {
		newTableSchema.reset()
	})

	const onBlur = () => {
		if (!$form.schema.length) {
			addField()
		}
	}
</script>

<Modal
	title={$t('Create New Table') ?? undefined}
	placement="top-center"
	class="static w-full rounded-sm"
	size="lg"
	bind:open={$createTableModal.open}
>
	<form id="createTable" class="flex flex-col justify-between flex-1 gap-2" method="POST" use:enhance>
		<div>
			<div class="space-y-4">
				<Label class="space-y-2">
					<span>
						<span>{$t('Name', { ns: 'common' })}</span>
						<span class="text-red-500">*</span>
					</span>
					<Input
						data-auto-focus
						id="name"
						name="name"
						type="text"
						label="name"
						bind:value={$form.name}
						data-invalid={$errors.name}
						required
						on:blur={onBlur}
						{...$constraints.name}
					/>
				</Label>

				<P class="flex text-xs items-center !font-bold gap-2">
					<span>{$t('System fields')}: </span>
					<Badge color="dark">id</Badge>,
					<Badge color="dark">{$t('created-at')}</Badge>,
					<Badge color="dark">{$t('created-by')}</Badge>,
					<Badge color="dark">{$t('created-by')}</Badge>,
					<Badge color="dark">{$t('created-by')}</Badge>
				</P>

				{#if $form.schema?.length}
					<Accordion class="my-4">
						{#each $form.schema as field, i (field.id)}
							<CreateTableFieldAccordionItem bind:open={opened[field.id ?? '']} {superFrm} {i} {field} isNew />
						{/each}
					</Accordion>
				{/if}
			</div>

			<Button color="light" outline class="w-full my-3" on:click={addField}>
				<i class="ti ti-plus text-sm mr-4" />
				{$t('Create New Field')}</Button
			>
		</div>
	</form>

	<!-- <SuperDebug data={$form} /> -->

	<svelte:fragment slot="footer">
		<div class="w-full flex justify-end gap-2">
			<Button color="alternative" on:click={createTableModal.close}>{$t('Cancel', { ns: 'common' })}</Button>
			<Button class="gap-4" type="submit" form="createTable" disabled={$submitting}>
				{#if $delayed}
					<Spinner size="5" />
				{/if}
				{$t('Create New Table')}</Button
			>
		</div>
	</svelte:fragment>
</Modal>

{#if $createTable.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$createTable.error.message}
		</span>
	</Toast>
{/if}
