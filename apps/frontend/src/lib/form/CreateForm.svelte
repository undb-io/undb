<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { t } from '$lib/i18n'
	import { formDrawerMode } from '$lib/store/drawer'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { createFormSchema } from '@undb/core'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms/index'
	import { Label } from '$lib/components/ui/label'
	import { Input } from '$lib/components/ui/input'
	import { Button } from '$lib/components/ui/button'
	import { toast } from 'svelte-sonner'

	export let data: Validation<typeof createFormSchema>

	const table = getTable()

	const createForm = trpc().table.form.create.mutation({
		async onSuccess(data, variables, context) {
			toast.success($t('TABLE.FORM_CREATED', { ns: 'success', name: $form.name }))
			$formDrawerMode = 'list'
			await invalidate(`table:${$table.id.value}`)
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

	const { form, enhance } = superForm(data, {
		id: 'createForm',
		SPA: true,
		dataType: 'json',
		applyAction: true,
		taintedMessage: null,
		async onUpdate(event) {
			$createForm.mutate({
				tableId: $table.id.value,
				form: {
					name: event.form.data.name,
				},
			})
		},
	})
</script>

<form id="createForm" method="POST" class="flex-1" use:enhance>
	<div class="h-full flex flex-col justify-between">
		<div class="space-y-2">
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Name', { ns: 'common' })}</span>
					<span class="text-red-500">*</span>
				</div>

				<Input name="name" type="text" bind:value={$form.name} />
			</Label>
		</div>
		<div class="w-full flex justify-end gap-4 mt-4">
			<Button size="sm" variant="secondary" on:click={() => ($formDrawerMode = 'list')}
				>{$t('Cancel', { ns: 'common' })}</Button
			>
			<Button size="sm" form="createForm" type="submit">{$t('Confirm', { ns: 'common' })}</Button>
		</div>
	</div>
</form>
