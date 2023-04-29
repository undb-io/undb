<script lang="ts">
	import { invalidate } from '$app/navigation'
	import CellInput from '$lib/cell/CellInput/CellInput.svelte'
	import { getTable, getView } from '$lib/store/table'
	import { createRecordInitial, createRecordOpen } from '$lib/store/modal'
	import { trpc } from '$lib/trpc/client'
	import { Button, Label, Modal, Spinner, Toast } from 'flowbite-svelte'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { slide } from 'svelte/transition'
	import { t } from '$lib/i18n'

	const table = getTable()
	const view = getView()

	export let data: Validation<any>
	$: fields = $view.getOrderedFields($table.schema.nonSystemFields)

	const createRecord = trpc.record.create.mutation()

	const { form, enhance, constraints, delayed, reset, submitting } = superForm(data, {
		id: 'createRecord',
		SPA: true,
		dataType: 'json',
		invalidateAll: false,
		resetForm: true,
		delayMs: 100,
		clearOnSubmit: 'errors-and-message',
		taintedMessage: null,
		async onUpdate(event) {
			await $createRecord.mutateAsync({ tableId: $table.id.value, values: event.form.data })
			await invalidate(`records:${$table.id.value}`)
			reset()
			createRecordOpen.set(false)
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
					<CellInput {field} bind:value={$form[field.id.value]} {...$constraints[field.id.value]} />
				</div>
			{/each}
		</div>
	</form>

	<svelte:fragment slot="footer">
		<div class="w-full flex justify-end gap-2">
			<Button color="alternative" on:click={() => createRecordOpen.set(false)}>{$t('Cancel', { ns: 'common' })}</Button>
			<Button class="gap-4" type="submit" form="createRecord" disabled={$submitting}>
				{#if $delayed}
					<Spinner size="5" />
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
