<script lang="ts">
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import { getTable, getView } from '$lib/store/table'
	import { createRecordInitial, createRecordModal } from '$lib/store/modal'
	import { trpc } from '$lib/trpc/client'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import { keys } from 'lodash-es'
	import { pick } from 'lodash-es'
	import * as Dialog from '$lib/components/ui/dialog'
	import { Button } from '$lib/components/ui/button'
	import { createRecordForm } from '$lib/store/table'
	import { Label } from '$components/ui/label'
	import Toast from '$components/ui/toast/toast.svelte'
	import type { Field } from '@undb/core'
	import Badge from '$components/ui/badge/badge.svelte'

	const table = getTable()
	const view = getView()

	export let data: Validation<any>
	let fields: Field[] = []

	$: {
		if ($createRecordForm) {
			fields = $createRecordForm.getNotHiddenFields($table.schema)
		} else {
			fields = $view.getOrderedFields($table.schema.nonSystemFields)
		}
	}

	const createRecord = trpc().record.create.mutation({
		async onSuccess(data, variables, context) {
			await $createRecordModal.callback()
			createRecordModal.close()
			reset()
		},
	})

	const { form, enhance, constraints, delayed, reset, submitting, tainted } = superForm(data, {
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
</script>

<Dialog.Root bind:open={$createRecordModal.open}>
	<Dialog.Content class="!w-3/4 max-w-none h-[calc(100vh-64px)] overflow-y-hidden flex flex-col p-0">
		<Dialog.Header class="border-b p-6">
			<Dialog.Title class="gap-2 items-center flex">
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
				<div class="grid grid-cols-5 gap-x-3 gap-y-4 items-center">
					{#each fields as field}
						<div class="h-full items-start gap-1 pt-2">
							<Label class="leading-5" for={field.id.value}>
								<div class="inline-flex items-center gap-2" data-field-id={field.id.value}>
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
							<CellInput class="w-full" {field} bind:value={$form[field.id.value]} {...$constraints[field.id.value]} />
						</div>
					{/each}
				</div>
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

{#if $createRecord.error}
	<Toast class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$createRecord.error.message}
		</span>
	</Toast>
{/if}
