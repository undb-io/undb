<script lang="ts">
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
	import { t } from '$lib/i18n'
	import { getTable } from '$lib/store/table'
	import { invalidate } from '$app/navigation'
	import CreateTableFieldAccordionItem from './CreateTableFieldAccordionItem.svelte'
	import { confirmDeleteTable, updateTableModal } from '$lib/store/modal'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { toast } from 'svelte-sonner'
	import { tick } from 'svelte'

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
		async onSuccess() {
			toast.success($t('TABLE.UPDATED', { ns: 'success', name: $table.name.value }))
			await invalidate(`table:${$table.id.value}`)
			reset()
			await tick()
			updateTableModal.close()
		},
		onSettled() {
			updateTableModal.close()
		},
		onError(error) {
			toast.error(error.message)
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

	const { form, reset, constraints, enhance, delayed, submitting } = superFrm

	$: displayFields = $form.schema?.filter((f) => !!f.display) ?? []
</script>

<Dialog.Root bind:open={$updateTableModal.open}>
	<Dialog.Content class="!w-3/4 max-w-none max-h-[95%] flex flex-col overflow-y-hidden p-0">
		<Dialog.Header class="border-b py-4 px-6">
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
									$confirmDeleteTable = true
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

		<form
			id="updateTable"
			class="flex flex-col justify-between flex-1 gap-2 overflow-y-auto py-4 px-6"
			method="POST"
			use:enhance
		>
			<div class="space-y-4">
				<Label class="space-y-2">
					<span>
						<span>{$t('Name', { ns: 'common' })}</span>
						<span class="text-red-500">*</span>
					</span>
					<Input id="name" name="name" type="text" bind:value={$form.name} required {...$constraints.name} />
				</Label>

				<div class="flex">
					<span class="inline-block mr-2 text-sm dark:text-white text-gray-700">
						{$t('Display Fields')}:
					</span>
					<div class="flex gap-2">
						{#each displayFields as field}
							<Badge variant="secondary">
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
										<Badge>
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

		<Dialog.Footer class="border-t py-4 px-6">
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
