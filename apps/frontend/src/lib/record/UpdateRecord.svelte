<script lang="ts">
	import {
		currentRecordId,
		getRecord,
		getTable,
		getView,
		nextRecord,
		previousRecord,
		q,
		readonly,
		recordHash,
	} from '$lib/store/table'
	import { createMutateRecordValuesSchema } from '@undb/core'
	import { Button, ButtonGroup, Label, Modal, P, Spinner, Toast } from 'flowbite-svelte'
	import { superForm } from 'sveltekit-superforms/client'
	import { writable } from 'svelte/store'
	import type { Validation } from 'sveltekit-superforms/index'
	import { trpc } from '$lib/trpc/client'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { pick, keys } from 'lodash-es'
	import { slide } from 'svelte/transition'
	import { t } from '$lib/i18n'
	import UpdateRecordMenu from './UpdateRecordMenu.svelte'

	const table = getTable()
	const view = getView()
	const record = getRecord()

	export let data: Validation<any>

	$: validators = createMutateRecordValuesSchema(fields ?? [], $record?.valuesJSON)
	$: fields = $view.getOrderedFields($table.schema.nonSystemFields)
	$: records = trpc().record.list.query(
		{ tableId: $table.id.value, viewId: $view.id.value, q: $q },
		{ queryHash: $recordHash, enabled: false, refetchOnMount: false, refetchOnWindowFocus: false },
	)

	const updateRecord = trpc().record.update.mutation({
		async onSuccess(data, variables, context) {
			await $records.refetch()
			currentRecordId.set(undefined)
		},
	})

	const superFrm = superForm(data, {
		id: 'updateRecord',
		SPA: true,
		applyAction: true,
		validators,
		dataType: 'json',
		invalidateAll: false,
		resetForm: true,
		clearOnSubmit: 'errors-and-message',
		taintedMessage: null,
		delayMs: 100,
		async onUpdate(event) {
			if ($readonly) return
			if (!$record) return
			const taintedKeys = keys($tainted)
			const values = pick(event.form.data, taintedKeys)
			$updateRecord.mutate({
				tableId: $table.id.value,
				id: $record.id.value,
				values,
			})
		},
	})

	const { form, enhance, delayed, tainted, submitting } = superFrm

	const open = writable<boolean>(false)
	$: {
		open.set(!!$currentRecordId)
	}
	$: if (!$open) {
		currentRecordId.set(undefined)
	}
</script>

{#key $record}
	<Modal class="w-full " size="lg" bind:open={$open}>
		{#if !$record}
			<div class="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-50 z-50 flex items-center justify-center">
				<Spinner />
			</div>
		{/if}
		<svelte:fragment slot="header">
			<div class="flex items-center w-full justify-between mr-6">
				<div class="flex items-center space-x-4">
					<P>{$t('Update Record')}</P>
					<ButtonGroup size="xs">
						<Button
							size="xs"
							disabled={!$previousRecord}
							on:click={() => ($currentRecordId = $previousRecord?.id.value)}
						>
							<i class="ti ti-chevron-left text-gray-500 text-base" />
						</Button>
						<Button size="xs" disabled={!$nextRecord} on:click={() => ($currentRecordId = $nextRecord?.id.value)}>
							<i class="ti ti-chevron-right text-gray-500 text-base" />
						</Button>
					</ButtonGroup>
				</div>

				<UpdateRecordMenu record={$record} />
			</div>
		</svelte:fragment>
		<form id="updateRecord" class="space-y-5" method="POST" use:enhance>
			<div class="grid grid-cols-5 gap-x-3 gap-y-4 items-center">
				{#each fields as field}
					<div class="h-full items-start gap-1 pt-2">
						<Label class="leading-5" for={field.id.value}>
							<div class="inline-flex items-center gap-2">
								<FieldIcon type={field.type} size={16} />
								<span>
									{field.name.value}
								</span>
							</div>
							{#if field.required}
								<span class="text-red-500">*</span>
							{/if}
						</Label>
					</div>
					<div class="col-span-4">
						<CellInput record={$record} {field} bind:value={$form[field.id.value]} readonly={$readonly} />
					</div>
				{/each}
			</div>
		</form>

		<svelte:fragment slot="footer">
			<div class="w-full flex justify-end gap-2">
				<Button color="alternative" on:click={() => ($currentRecordId = undefined)}
					>{$t('Cancel', { ns: 'common' })}</Button
				>
				<Button class="gap-2" type="submit" form="updateRecord" disabled={$submitting}>
					{#if $delayed}
						<Spinner size="5" />
					{:else}
						<i class="ti ti-edit" />
					{/if}
					{$t('Update Record')}</Button
				>
			</div>
		</svelte:fragment>
	</Modal>
{/key}

{#if $updateRecord.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$updateRecord.error.message}
		</span>
	</Toast>
{/if}
