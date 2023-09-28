<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import OptionColorPicker from './OptionColorPicker.svelte'
	import { OptionColor, type createOptionSchema } from '@undb/core'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms/index'
	import { trpc } from '$lib/trpc/client'
	import { getField, getTable } from '$lib/store/table'
	import { t } from '$lib/i18n'
	import { invalidate } from '$app/navigation'
	import { createOptionModal } from '$lib/store/modal'
	import { Input } from '$components/ui/input'
	import * as Dialog from '$lib/components/ui/dialog'
	import { toast } from 'svelte-sonner'

	export let data: Validation<typeof createOptionSchema>

	const table = getTable()
	const field = getField()

	const createOption = trpc().table.field.select.createOption.mutation({
		async onSuccess(data, variables, context) {
			toast.success($t('TABLE.OPTION_CREATED', { ns: 'success', name: variables.option.name }))
			reset()
			await invalidate(`table:${$table.id.value}`)
			createOptionModal.close()
		},
		onError(error, variables, context) {
			toast.error(error.message)
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
	<Dialog.Root bind:open={$createOptionModal.open}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>{$t('Create New Option') ?? undefined}</Dialog.Title>
			</Dialog.Header>

			<form id="createOption" class="flex gap-2 items-center" method="POST" use:enhance>
				{#if $form.color}
					<OptionColorPicker bind:value={$form.color.name} name={$form.name} />
				{/if}
				<Input name="name" type="text" bind:value={$form.name} />
			</form>

			<Dialog.Footer>
				<div class="w-full flex justify-end gap-4">
					<Button size="sm" variant="secondary">{$t('Cancel', { ns: 'common' })}</Button>
					<Button size="sm" form="createOption" type="submit">{$t('Confirm', { ns: 'common' })}</Button>
				</div>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
