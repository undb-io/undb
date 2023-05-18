<script lang="ts">
	import { Button, Input, Modal, Toast } from 'flowbite-svelte'
	import OptionColorPicker from './OptionColorPicker.svelte'
	import type { updateOptionSchema } from '@undb/core'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms/index'
	import { trpc } from '$lib/trpc/client'
	import { getField, getOption, getTable } from '$lib/store/table'
	import { slide } from 'svelte/transition'
	import { t } from '$lib/i18n'
	import { invalidate } from '$app/navigation'
	import { updateOptionModal } from '$lib/store/modal'

	export let data: Validation<typeof updateOptionSchema>

	const table = getTable()
	const field = getField()
	const option = getOption()

	const updateOption = trpc().table.field.select.updateOption.mutation({
		async onSuccess(data, variables, context) {
			reset()
			await invalidate(`table:${$table.id.value}`)
			updateOptionModal.close()
		},
	})

	const { form, enhance, reset } = superForm(data, {
		id: 'updateOption',
		SPA: true,
		dataType: 'json',
		applyAction: true,
		taintedMessage: null,
		async onUpdate(event) {
			if (!$field || !$option) return
			$updateOption.mutate({
				tableId: $table.id.value,
				fieldId: $field?.id.value,
				option: event.form.data,
				id: $option.key.value,
			})
		},
	})

	$: if ($option) {
		$form.key = $option.key.value
		$form.name = $option.name.value
		$form.color = $option.color.toJSON()
	}
</script>

{#if $field?.type === 'select'}
	<Modal
		title={$t('Update Option') ?? undefined}
		bind:open={$updateOptionModal.open}
		placement="top-center"
		class="w-full rounded-sm"
		size="sm"
	>
		<form id="updateOption" class="flex gap-2 items-center" method="POST" use:enhance>
			<OptionColorPicker bind:value={$form.color.name} name={$form.name} />
			<Input class="rounded-none outline-none border-none" name="name" size="sm" type="text" bind:value={$form.name} />
		</form>

		<svelte:fragment slot="footer">
			<div class="w-full flex justify-end gap-4">
				<Button size="xs" color="alternative">{$t('Cancel', { ns: 'common' })}</Button>
				<Button size="xs" form="updateOption" type="submit">{$t('Confirm', { ns: 'common' })}</Button>
			</div>
		</svelte:fragment>
	</Modal>
{/if}

{#if $updateOption.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$updateOption.error.message}
		</span>
	</Toast>
{/if}
