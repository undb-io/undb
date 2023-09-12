<script lang="ts">
	import { selectedFormId } from '$lib/store/drawer'
	import { formEditorModal, formListDrawer } from '$lib/store/modal'
	import type { Form } from '@undb/core'
	import * as Card from '$lib/components/ui/card'
	import Button from '$components/ui/button/button.svelte'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import { getTable } from '$lib/store/table'

	export let form: Form

	const table = getTable()

	let confirmDeleteForm = false

	const deleteForm = trpc().table.form.delete.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})
</script>

<Card.Root class="w-full !max-w-none shadow-sm cursor-pointer hover:shadow-md transition-all group">
	<Card.Header>
		<div
			on:click={() => {
				$selectedFormId = form.id.value
				formListDrawer.close()
				formEditorModal.open()
			}}
			class="flex items-center justify-between"
		>
			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-3">
					<i class="ti ti-forms" />
					<p class="font-semibold text-lg">{form.name.value}</p>
				</div>
			</div>

			<Button
				variant="destructive"
				class="opacity-0 group-hover:opacity-70 transition p-3 hover:opacity-100"
				on:click={(e) => {
					e.stopPropagation()
					confirmDeleteForm = true
				}}
			>
				<i class="ti ti-trash"></i>
			</Button>
		</div>
	</Card.Header>
</Card.Root>

<AlertDialog.Root bind:open={confirmDeleteForm}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{$t('confirm delete form')}
			</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel
				on:click={() => {
					confirmDeleteForm = false
				}}
			>
				{$t('Cancel', { ns: 'common' })}
			</AlertDialog.Cancel>
			<AlertDialog.Action
				variant="destructive"
				on:click={() => {
					$deleteForm.mutate({
						tableId: $table.id.value,
						formId: form.id.value,
					})
				}}
			>
				{$t('Confirm', { ns: 'common' })}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
