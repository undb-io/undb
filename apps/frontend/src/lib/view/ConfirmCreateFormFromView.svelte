<script lang="ts">
	import { invalidate } from '$app/navigation'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { t } from '$lib/i18n'
	import { selectedFormId } from '$lib/store/drawer'
	import { confirmCreateFormFromView, formEditorModal } from '$lib/store/modal'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { FormId, type ViewVO } from '@undb/core'
	import { toast } from 'svelte-sonner'

	const table = getTable()
	export let view: ViewVO

	const createFormFromViewMutation = trpc().table.form.createFromView.mutation({
		async onSuccess(data, variables, context) {
			toast.success($t('TABLE.CREATE_FORM_FROM_VIEW', { ns: 'success' }))
			const id = variables.form.id
			await invalidate(`table:${$table.id.value}`)
			selectedFormId.set(id)
			formEditorModal.open()
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

	const createFormFromView = () => {
		const id = FormId.createId()
		$createFormFromViewMutation.mutate({
			tableId: $table.id.value,
			viewId: view.id.value,
			form: { id },
		})
	}
</script>

<AlertDialog.Root bind:open={$confirmCreateFormFromView}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{$t('create form from view')}?
			</AlertDialog.Title>
		</AlertDialog.Header>

		<AlertDialog.Footer>
			<AlertDialog.Cancel>
				{$t('Cancel', { ns: 'common' })}
			</AlertDialog.Cancel>
			<AlertDialog.Action on:click={createFormFromView}>
				{$t('Confirm', { ns: 'common' })}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
