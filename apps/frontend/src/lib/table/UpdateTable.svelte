<script lang="ts">
	import { Toast } from 'flowbite-svelte'
	import { Label } from '$lib/components/ui/label'
	import { Input } from '$lib/components/ui/input'
	import { Button } from '$components/ui/button'
	import { Badge } from '$components/ui/badge'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Accordion from '$lib/components/ui/accordion'
	import type { Validation } from 'sveltekit-superforms'
	import { FieldId, createUpdateTableSchema } from '@undb/core'
	import { superForm } from 'sveltekit-superforms/client'
	import { trpc } from '$lib/trpc/client'
	import { slide } from 'svelte/transition'
	import { t } from '$lib/i18n'
	import { getTable } from '$lib/store/table'
	import { goto, invalidate, invalidateAll } from '$app/navigation'
	import CreateTableFieldAccordionItem from './CreateTableFieldAccordionItem.svelte'
	import { updateTableModal } from '$lib/store/modal'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'

	export let data: Validation<ReturnType<typeof createUpdateTableSchema>>
	let opened: Record<string, boolean> = {}

	const table = getTable()

	$: newFields = {} as Record<string, boolean>
	const addField = () => {
		const id = FieldId.createId()
		newFields[id] = true
		$form.schema = [...($form.schema ?? []), { id, type: 'string', name: '', display: !displayFields.length }]
		opened = { [id]: true }
	}

	const updateTable = trpc().table.update.mutation({
		async onSuccess(data, variables, context) {
			updateTableModal.close()
			await invalidate(`table:${$table.id.value}`)
			reset()
		},
	})

	const deleteTable = trpc().table.delete.mutation({
		async onSuccess(data, variables, context) {
			await invalidateAll()
			await goto('/')
		},
	})

	const superFrm = superForm(data, {
		id: 'updateTable',
		SPA: true,
		applyAction: true,
		resetForm: true,
		invalidateAll: true,
		clearOnSubmit: 'errors-and-message',
		dataType: 'json',
		taintedMessage: null,
		validators: createUpdateTableSchema($table),
		async onUpdate(event) {
			$updateTable.mutate({ id: $table.id.value, ...event.form.data })
		},
	})

	const { form, errors, reset, constraints, enhance, delayed, submitting } = superFrm

	$: displayFields = $form.schema?.filter((f) => !!f.display) ?? []
	let confirmDeleteTable = false
</script>

<Dialog.Root bind:open={$updateTableModal.open}>
	<Dialog.Content class="!w-3/4 max-w-none max-h-[95%] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title class="pr-6">
				<div class="flex justify-between w-full mr-6 dark:text-gray-200">
					<p class="text-lg dark:text-white">{$t('Update Table')}</p>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<button>
								<i class="ti ti-dots" />
							</button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Item
								class="text-red-500 gap-2"
								on:click={() => {
									confirmDeleteTable = true
								}}
							>
								<i class="ti ti-trash" />
								<span class="text-xs">{$t('Delete Table')}</span>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</Dialog.Title>
		</Dialog.Header>

		<form id="updateTable" class="flex flex-col justify-between flex-1 gap-2" method="POST" use:enhance>
			<div class="space-y-2">
				<div>
					<Label class="space-y-2">
						<span>
							<span>{$t('Name', { ns: 'common' })}</span>
							<span class="text-red-500">*</span>
						</span>
						<Input id="name" name="name" type="text" bind:value={$form.name} required {...$constraints.name} />
					</Label>
				</div>

				<div class="flex">
					<span class="inline-block mr-2 text-sm">
						{$t('Display Fields')}:
					</span>
					<div class="flex gap-2">
						{#each displayFields as field}
							<Badge>
								{field.name}
							</Badge>
						{/each}
					</div>
				</div>
				{#if $form.schema?.length}
					<Accordion.Root class="my-4">
						{#each $form.schema as field, i (field.id)}
							{@const isNew = !!newFields[field.id ?? '']}
							<CreateTableFieldAccordionItem bind:open={opened[field.id ?? '']} {superFrm} {i} {field} {isNew}>
								<svelte:fragment slot="header">
									{#if isNew}
										<Badge color="green">
											{$t('new field')}
										</Badge>
									{/if}
								</svelte:fragment>
							</CreateTableFieldAccordionItem>
						{/each}
					</Accordion.Root>
				{/if}

				<Button variant="secondary" class="w-full my-3" on:click={addField}>
					<i class="ti ti-plus text-sm mr-4" />
					{$t('Create New Field')}
				</Button>
			</div>
		</form>

		<Dialog.Footer>
			<div class="w-full flex justify-end gap-2">
				<Button variant="secondary" type="button" on:click={updateTableModal.close}
					>{$t('Cancel', { ns: 'common' })}</Button
				>
				<Button class="gap-4" type="submit" form="updateTable" disabled={$submitting}>
					{#if $delayed}
						<i class="ti ti-rotate animate-spin"></i>
					{/if}
					{$t('Update Table')}
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

{#if $updateTable.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$updateTable.error.message}
		</span>
	</Toast>
{/if}

<AlertDialog.Root bind:open={confirmDeleteTable}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{$t('Confirm Delete Table')}</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>
				{$t('Confirm No', { ns: 'common' })}
			</AlertDialog.Cancel>
			<AlertDialog.Action disabled={$deleteTable.isLoading}>
				{#if $deleteTable.isLoading}
					<i class="ti ti-rotate animate-spin"></i>
				{:else}
					<i class="ti ti-circle-check text-lg" />
				{/if}
				<span
					on:click={() => {
						$deleteTable.mutate({ id: $table.id.value })
					}}
				>
					{$t('Confirm Yes', { ns: 'common' })}
				</span>
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
