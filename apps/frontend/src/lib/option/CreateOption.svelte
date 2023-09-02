<script lang="ts">
	import { Input, Modal, Toast } from 'flowbite-svelte'
	import { Button } from '$lib/components/ui/button'
	import OptionColorPicker from './OptionColorPicker.svelte'
	import { OptionColor, type createOptionSchema } from '@undb/core'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms/index'
	import { trpc } from '$lib/trpc/client'
	import { getField, getTable } from '$lib/store/table'
	import { slide } from 'svelte/transition'
	import { t } from '$lib/i18n'
	import { invalidate } from '$app/navigation'
	import { createOptionModal } from '$lib/store/modal'

	export let data: Validation<typeof createOptionSchema>

	const table = getTable()
	const field = getField()

	const createOption = trpc().table.field.select.createOption.mutation({
		async onSuccess(data, variables, context) {
			reset()
			await invalidate(`table:${$table.id.value}`)
			createOptionModal.close()
		},
	})

	const { form, enhance, reset } = superForm(data, {
		id: 'createOption',
		SPA: true,
		dataType: 'json',
		applyAction: true,
		taintedMessage: null,
		async onUpdate(event) {
			if (!$field) return
			$createOption.mutate({
				tableId: $table.id.value,
				fieldId: $field?.id.value,
				option: event.form.data,
			})
		},
	})

	$: if ($field?.type === 'select' || $field?.type === 'multi-select') {
		$form.color = $field.options.lastOption.into()?.color.next().toJSON() || OptionColor.defaultColor.toJSON()
	}
</script>

{#if $field?.type === 'select' || $field?.type === 'multi-select'}
	<Modal
		title={$t('Create New Option') ?? undefined}
		bind:open={$createOptionModal.open}
		placement="top-center"
		class="w-full rounded-sm"
		size="sm"
	>
		<form id="createOption" class="flex gap-2 items-center" method="POST" use:enhance>
			<OptionColorPicker bind:value={$form.color.name} name={$form.name} />
			<Input class="rounded-none outline-none border-none" name="name" size="sm" type="text" bind:value={$form.name} />
		</form>

		<svelte:fragment slot="footer">
			<div class="w-full flex justify-end gap-4">
				<Button size="sm" variant="secondary">{$t('Cancel', { ns: 'common' })}</Button>
				<Button size="sm" form="createOption" type="submit">{$t('Confirm', { ns: 'common' })}</Button>
			</div>
		</svelte:fragment>
	</Modal>
{/if}

{#if $createOption.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$createOption.error.message}
		</span>
	</Toast>
{/if}
