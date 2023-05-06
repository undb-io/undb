<script lang="ts">
	import { invalidate } from '$app/navigation'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import { getTable, getView, recordHash } from '$lib/store/table'
	import { createRecordInitial, createRecordOpen } from '$lib/store/modal'
	import { trpc } from '$lib/trpc/client'
	import { Button, Label, Modal, Spinner, Toast } from 'flowbite-svelte'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { slide } from 'svelte/transition'
	import { t } from '$lib/i18n'
	import { keys } from 'lodash-es'
	import { pick } from 'lodash-es'

	const table = getTable()
	const view = getView()

	export let data: Validation<any>
	$: fields = $view.getOrderedFields($table.schema.nonSystemFields)

	const records = trpc().record.list.query(
		{ tableId: $table.id.value, viewId: $view.id.value },
		{
			queryHash: $recordHash,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			enabled: false,
		},
	)

	const createRecord = trpc().record.create.mutation({
		async onSuccess(data, variables, context) {
			await $records.refetch()
			reset()
			createRecordOpen.set(false)
		},
	})

	const { form, enhance, constraints, delayed, reset, submitting, tainted } = superForm(data, {
		id: 'createRecord',
		SPA: true,
		dataType: 'json',
		invalidateAll: false,
		resetForm: true,
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

<Modal title={$t('Create New Record') ?? undefined} class="w-full" size="lg" bind:open={$createRecordOpen}>
	<form id="createRecord" class="space-y-5" method="POST" use:enhance>
		<div class="grid grid-cols-5 gap-x-3 gap-y-4 items-center">
			{#each fields as field}
				<div class="h-full items-start gap-1 pt-2">
					<Label class="leading-5" for={field.id.value} data-field-id={field.id.value}>
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
					<CellInput class="w-full" {field} bind:value={$form[field.id.value]} {...$constraints[field.id.value]} />
				</div>
			{/each}
		</div>
	</form>

	<svelte:fragment slot="footer">
		<div class="w-full flex justify-end gap-2">
			<Button color="alternative" on:click={() => createRecordOpen.set(false)}>{$t('Cancel', { ns: 'common' })}</Button>
			<Button class="gap-2" type="submit" form="createRecord" disabled={$submitting}>
				{#if $delayed}
					<Spinner size="5" />
				{:else}
					<i class="ti ti-row-insert-bottom" />
				{/if}
				{$t('Create New Record')}</Button
			>
		</div>
	</svelte:fragment>
</Modal>

{#if $createRecord.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$createRecord.error.message}
		</span>
	</Toast>
{/if}
