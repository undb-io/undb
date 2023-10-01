<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion'
	import type { Validation } from 'sveltekit-superforms'
	import { FieldId, TableId, type createTableInput } from '@undb/core'
	import { superForm } from 'sveltekit-superforms/client'
	import CreateTableFieldAccordionItem from './CreateTableFieldAccordionItem.svelte'
	import { trpc } from '$lib/trpc/client'
	import { goto, invalidate } from '$app/navigation'
	import { t } from '$lib/i18n'
	import { createTableModal } from '$lib/store/modal'
	import { createTableDefaultValue, newTableSchema } from '$lib/store/table'
	import { onDestroy } from 'svelte'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Label } from '$lib/components/ui/label'
	import { Input } from '$lib/components/ui/input'
	import { Button } from '$components/ui/button'
	import { Badge } from '$lib/components/ui/badge'
	import BasePicker from '$lib/base/BasePicker.svelte'
	import { toast } from 'svelte-sonner'

	export let data: Validation<typeof createTableInput>
	let currentField: string | undefined

	const addField = () => {
		const id = FieldId.createId()
		$form.schema = [
			...($form.schema ?? []),
			{
				id,
				type: 'string',
				name: `${$t('Field')} ${($form.schema?.length ?? 0) + 1}`,
				display: !displayFields?.length,
			},
		]
		currentField = id
	}

	$: if (!$form.schema?.length) {
		addField()
	}

	const createTable = trpc().table.create.mutation({
		async onSuccess(data, variables, context) {
			toast.success($t('TABLE.CREATED', { ns: 'success', name: $form.name }))
			createTableModal.close()
			await invalidate('tables')
			await goto(`/t/${data.id}`)
			reset()
		},
		onError(error, variables, context) {
			toast.error(error.message)
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
	$: if ($createTableDefaultValue) {
		for (const [key, value] of Object.entries($createTableDefaultValue)) {
			// @ts-ignore
			$form[key] = value
		}
	}
	$: $form.schema = []
	$: displayFields = $form.schema?.filter((f) => !!f.display) ?? []

	$: if ($createTableModal.open) {
		newTableSchema.set({
			tableId: $form.id,
			tableName: $form.name,
			schema: $form.schema,
		})
	} else {
		newTableSchema.reset()
	}

	onDestroy(() => {
		newTableSchema.reset()
	})

	const onBlur = () => {
		if (!$form.schema.length) {
			addField()
		}
	}
</script>

<Dialog.Root bind:open={$createTableModal.open}>
	<Dialog.Content class="!w-1/2 !max-w-none max-h-[90%] flex flex-col overflow-y-hidden">
		<Dialog.Header>
			<Dialog.Title>{$t('Create New Table') ?? undefined}</Dialog.Title>
		</Dialog.Header>

		<form id="createTable" class="flex flex-col justify-between flex-1 gap-2 overflow-y-auto" method="POST" use:enhance>
			<div>
				<div class="space-y-4">
					<div class="flex items-end gap-2">
						<Label class="space-y-2 flex-1">
							<span>
								<span>{$t('Name', { ns: 'common' })}</span>
								<span class="text-red-500">*</span>
							</span>
							<Input
								id="name"
								name="name"
								type="text"
								bind:value={$form.name}
								required
								on:blur={onBlur}
								{...$constraints.name}
							/>
						</Label>
						<BasePicker enabled bind:value={$form.baseId} />
					</div>

					<p class="flex text-xs items-center !font-bold gap-1 dark:text-white">
						<span>{$t('System fields')}: </span>
						<Badge variant="secondary">id</Badge>,
						<Badge variant="secondary">{$t('created-at')}</Badge>,
						<Badge variant="secondary">{$t('created-by')}</Badge>,
						<Badge variant="secondary">{$t('updated-at')}</Badge>,
						<Badge variant="secondary">{$t('updated-by')}</Badge>
					</p>

					{#if $form.schema?.length}
						<Accordion.Root class="my-4" value={currentField}>
							{#each $form.schema as field, i (field.id)}
								<CreateTableFieldAccordionItem {superFrm} {i} {field} isNew />
							{/each}
						</Accordion.Root>
					{/if}
				</div>

				<Button variant="outline" type="button" class="w-full my-3" on:click={addField}>
					<i class="ti ti-plus text-sm mr-4" />
					{$t('Create New Field')}
				</Button>
			</div>
		</form>

		<!-- <SuperDebug data={$form} /> -->
		<Dialog.Footer>
			<div class="w-full flex justify-end gap-2">
				<Button variant="secondary" on:click={createTableModal.close}>{$t('Cancel', { ns: 'common' })}</Button>
				<Button class="gap-4" type="submit" form="createTable" disabled={$submitting}>
					{#if $delayed}
						<i class="ti ti-rotate animate-spin"></i>
					{/if}
					{$t('Create New Table')}</Button
				>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
