<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import OptionColorPicker from './OptionColorPicker.svelte'
	import type { updateOptionSchema } from '@undb/core'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms/index'
	import { trpc } from '$lib/trpc/client'
	import { getField, getOption, getTable } from '$lib/store/table'
	import { t } from '$lib/i18n'
	import { invalidate } from '$app/navigation'
	import { updateOptionModal } from '$lib/store/modal'
	import { Input } from '$components/ui/input'
	import * as Dialog from '$lib/components/ui/dialog'
	import { toast } from 'svelte-sonner'

	export let data: Validation<typeof updateOptionSchema>

	const table = getTable()
	const field = getField()
	const option = getOption()

	const updateOption = trpc().table.field.select.updateOption.mutation({
		async onSuccess(data, variables, context) {
			toast.success($t('TABLE.OPTION_UPDATED', { ns: 'success', name: variables.option.name }))
			reset()
			await invalidate(`table:${$table.id.value}`)
			updateOptionModal.close()
		},
		onError(error, variables, context) {
			toast.error(error.message)
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

{#if $field?.type === 'select' || $field?.type === 'multi-select'}
	<Dialog.Root bind:open={$updateOptionModal.open}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>
					{$t('Update Option') ?? undefined}
				</Dialog.Title>
			</Dialog.Header>

			<form id="updateOption" class="flex gap-2 items-center" method="POST" use:enhance>
				<OptionColorPicker bind:value={$form.color.name} name={$form.name} />
				<Input name="name" type="text" bind:value={$form.name} />
			</form>

			<Dialog.Footer>
				<div class="w-full flex justify-end gap-4">
					<Button size="sm" variant="secondary">{$t('Cancel', { ns: 'common' })}</Button>
					<Button size="sm" form="updateOption" type="submit">{$t('Confirm', { ns: 'common' })}</Button>
				</div>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
