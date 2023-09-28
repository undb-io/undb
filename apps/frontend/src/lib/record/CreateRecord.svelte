<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { createRecordInitial, createRecordModal } from '$lib/store/modal'
	import { trpc } from '$lib/trpc/client'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms'
	import { t } from '$lib/i18n'
	import { keys } from 'lodash-es'
	import { pick } from 'lodash-es'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Button } from '$lib/components/ui/button'
	import { createRecordForm } from '$lib/store/table'
	import { RecordFactory, type Field, WithRecordId, RecordId } from '@undb/core'
	import Badge from '$components/ui/badge/badge.svelte'
	import CreateRecordItem from './CreateRecordItem.svelte'
	import { me } from '$lib/store/me'
	import { toast } from 'svelte-sonner'

	const table = getTable()
	const view = getView()

	export let data: Validation<any>
	let fields: Field[] = []

	$: {
		if ($createRecordForm) {
			fields = $createRecordForm.getNotHiddenFields($table.schema)
		} else {
			fields = $view.getOrderedFields($table.schema.nonControlledFields)
		}
	}

	const createRecord = trpc().record.create.mutation({
		async onSuccess(data, variables, context) {
			toast.success($t('RECORD.CREATED', { ns: 'success' }))
			await $createRecordModal.callback()
			createRecordModal.close()
			reset()
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

	const { form, enhance, delayed, reset, submitting, tainted } = superForm(data, {
		id: 'createRecord',
		SPA: true,
		dataType: 'json',
		invalidateAll: false,
		resetForm: false,
		delayMs: 100,
		clearOnSubmit: 'errors-and-message',
		taintedMessage: null,
		async onUpdate(event) {
			const taintedKeys = keys($tainted)
			const values = pick(event.form.data, taintedKeys)
			$createRecord.mutate({ tableId: $table.id.value, values })
		},
	})

	$: if ($createRecordInitial) {
		for (const [key, value] of Object.entries($createRecordInitial)) {
			$form[key] = value
		}
	}

	$: $table, reset()

	$: values = pick($form, keys($tainted))

	const id = RecordId.create()
	$: tempRecord = RecordFactory.temp($table, values, $me.userId, new WithRecordId(id))
</script>

<Dialog.Root bind:open={$createRecordModal.open}>
	<Dialog.Content
		class="!w-3/4 max-w-none h-[calc(100vh-64px)] overflow-y-hidden flex flex-col p-0 bg-white dark:bg-gray-800"
	>
		<Dialog.Header class="border-b p-6">
			<Dialog.Title class="gap-2 items-center flex dark:text-white">
				<span>
					{$t('Create New Record')}
				</span>

				{#if $createRecordForm}
					<Badge variant="secondary">
						{$t('create record by form', { form: ` ${$createRecordForm.name.value} ` })}
					</Badge>
				{/if}
			</Dialog.Title>
		</Dialog.Header>

		<div class="flex-1 overflow-y-auto p-6">
			<form id="createRecord" class="space-y-5" method="POST" use:enhance>
				{#each fields as field (field.id.value)}
					<CreateRecordItem record={tempRecord} {field} bind:value={$form[field.id.value]} />
				{/each}
			</form>
		</div>
		<!-- <SuperDebug data={$form} /> -->

		<Dialog.Footer class="border-t p-6">
			<div class="w-full flex justify-end gap-2">
				<Button size="sm" variant="secondary" on:click={() => createRecordModal.close()}>
					{$t('Cancel', { ns: 'common' })}
				</Button>
				<Button size="sm" class="gap-2" type="submit" form="createRecord" disabled={$submitting}>
					{#if $delayed}
						<i class="ti ti-rotate animate-spin"></i>
					{:else}
						<i class="ti ti-row-insert-bottom" />
					{/if}
					{$t('Create New Record')}</Button
				>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
