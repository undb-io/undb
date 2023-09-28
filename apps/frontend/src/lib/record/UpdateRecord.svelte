<script lang="ts">
	import { cn } from '$lib/utils'
	import {
		currentRecordId,
		getRecord,
		getTable,
		getView,
		isShare,
		readonlyRecord,
		canUpdateRecordField,
	} from '$lib/store/table'
	import { createMutateRecordValuesSchema } from '@undb/core'
	import { Button } from '$components/ui/button'
	import { Label } from '$lib/components/ui/label'
	import { superForm } from 'sveltekit-superforms/client'
	import { writable } from 'svelte/store'
	import type { Validation } from 'sveltekit-superforms/index'
	import { trpc } from '$lib/trpc/client'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { pick, keys } from 'lodash-es'
	import { t } from '$lib/i18n'
	import ReadonlyRecordBadge from '$lib/authz/rls/ReadonlyRecordBadge.svelte'
	import UpdateRecordMenu from './UpdateRecordMenu.svelte'
	import RecordAudits from './RecordAudits.svelte'
	import { onMount } from 'svelte'
	import * as Dialog from '$lib/components/ui/dialog'
	import ConfirmDeleteRecord from './ConfirmDeleteRecord.svelte'
	import ConfirmDuplicateRecord from './ConfirmDuplicateRecord.svelte'
	import { toast } from 'svelte-sonner'

	const table = getTable()
	const view = getView()
	const record = getRecord()

	export let data: Validation<any>

	let displayAudits = true
	$: shouldDisplayAudits = displayAudits && !$isShare
	$: validators = createMutateRecordValuesSchema(fields ?? [], $record?.valuesJSON)
	$: fields = $view.getOrderedFields($table.schema.nonSystemFields)

	const updateRecord = trpc().record.update.mutation({
		async onSuccess() {
			toast.success($t('RECORD.UPDATED', { ns: 'success' }))
			currentRecordId.set(undefined)
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

	const superFrm = superForm(data, {
		id: 'updateRecord',
		SPA: true,
		applyAction: true,
		validators,
		dataType: 'json',
		invalidateAll: false,
		resetForm: false,
		clearOnSubmit: 'errors-and-message',
		taintedMessage: null,
		delayMs: 100,
		async onUpdate(event) {
			if ($readonlyRecord || !$record) return
			const taintedKeys = keys($tainted)
			const values = pick(event.form.data, taintedKeys)
			const oldValues = $record?.valuesJSON
			let changedSet = {}
			for (let key of taintedKeys) {
				if (values[key] !== oldValues?.[key]) {
					changedSet = {
						...changedSet,
						[key]: values[key],
					}
				}
			}
			if (Object.keys(changedSet).length === 0) {
				toast.warning($t('RECORD.NO_COLUMN_TO_UPDATE', { ns: 'warnings' }))
			} else {
				$updateRecord.mutate({
					tableId: $table.id.value,
					id: $record.id.value,
					values: changedSet,
				})
			}
		},
	})

	onMount(() => {
		$tainted = undefined
	})

	const { form, enhance, delayed, tainted, submitting } = superFrm

	const open = writable<boolean>(false)
	$: open.set(!!$currentRecordId)
</script>

<Dialog.Root
	bind:open={$open}
	onOpenChange={(open) => {
		if (!open) {
			currentRecordId.set(undefined)
		}
	}}
>
	{#key $record}
		<form id="updateRecord" class="space-y-5" method="POST" use:enhance>
			<Dialog.Content
				class="!w-[95%] lg:!w-3/4 !max-w-none h-[calc(100vh-64px)] overflow-y-hidden p-0 block gap-0 bg-white dark:bg-gray-800"
				id="updateRecord"
			>
				<Dialog.Header class="border-b border-gray-100 h-15 p-6">
					<Dialog.Title class="pr-6">
						<div class="flex items-center w-full justify-between mr-6">
							<div class="flex items-center space-x-4">
								<p class="dark:text-white">{$t('Update Record')}</p>
								{#if $record}
									<ReadonlyRecordBadge />
								{/if}
								<!-- <ButtonGroup size="xs">
								<Button size="xs" disabled={!$prevRecord} on:click={() => ($currentRecordId = $prevRecord?.id.value)}>
									<i class="ti ti-chevron-left text-gray-500 text-base" />
								</Button>
								<Button size="xs" disabled={!$nextRecord} on:click={() => ($currentRecordId = $nextRecord?.id.value)}>
									<i class="ti ti-chevron-right text-gray-500 text-base" />
								</Button>
							</ButtonGroup> -->
							</div>

							<div class="flex items-center gap-2">
								{#if !$isShare}
									<button on:click={() => (displayAudits = !displayAudits)} class="dark:text-white">
										<i class="ti ti-history"></i>
									</button>
								{/if}
								<UpdateRecordMenu record={$record} />
							</div>
						</div>
					</Dialog.Title>
				</Dialog.Header>

				<div class="h-[calc(100%-150px)] overflow-hidden">
					{#if !$record}
						<div
							class="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-50 z-50 flex items-center justify-center"
						>
							<i class="ti ti-rotate animate-spin"></i>
						</div>
					{/if}

					<div class="grid grid-cols-6 h-full">
						<div
							class={cn(
								'p-6 border-r dark:border-r-slate-900 h-full overflow-y-auto',
								shouldDisplayAudits ? 'col-span-4' : 'col-span-6',
							)}
						>
							<div class="grid grid-cols-5 gap-x-3 gap-y-4 items-center">
								{#each fields as field}
									{@const readonlyField = !$canUpdateRecordField(field.id.value)}
									<div class="h-full items-start gap-1 pt-2">
										<Label class="flex items-center gap-2 leading-5" for={field.id.value}>
											<div class="inline-flex items-center gap-2 truncate">
												<FieldIcon type={field.type} size={16} />
												<span class="truncate flex-1" title={field.name.value}>
													{field.name.value}
												</span>
											</div>
											{#if field.required}
												<span class="text-red-500 inline-flex self-center"> * </span>
											{/if}
										</Label>
									</div>
									<div class="col-span-4">
										<CellInput
											class="w-full"
											record={$record}
											{field}
											bind:value={$form[field.id.value]}
											readonly={$readonlyRecord || readonlyField ? true : undefined}
										/>
									</div>
								{/each}
							</div>
						</div>
						{#if shouldDisplayAudits}
							<div class="col-span-2 px-2 py-6 h-full overflow-y-auto bg-slate-50 dark:bg-slate-700">
								<RecordAudits />
							</div>
						{/if}
					</div>
				</div>

				<Dialog.Footer class="border-t border-gray-100 h-15 p-6">
					<div class="w-full flex justify-end gap-2">
						<Button variant="secondary" type="button" on:click={() => ($currentRecordId = undefined)}>
							{$t('Cancel', { ns: 'common' })}
						</Button>
						<Button class="gap-2" type="submit" form="updateRecord" disabled={$submitting || $readonlyRecord}>
							{#if $delayed}
								<i class="ti ti-rotate animate-spin"></i>
							{:else}
								<i class="ti ti-edit" />
							{/if}
							{$t('Update Record')}</Button
						>
					</div>
				</Dialog.Footer>

				<ConfirmDeleteRecord />
				<ConfirmDuplicateRecord />
			</Dialog.Content>
		</form>
	{/key}
</Dialog.Root>
