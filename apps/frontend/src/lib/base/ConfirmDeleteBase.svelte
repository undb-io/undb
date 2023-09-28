<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { t } from '$lib/i18n'
	import { confirmDeleteBase } from '$lib/store/modal'
	import { currentBaseId, currentBase } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { toast } from 'svelte-sonner'

	const deleteBaseMutation = trpc().base.delete.mutation({
		async onSuccess(data, variables, context) {
			toast.success($t('BASE.DELETED', { ns: 'success', name: $currentBase?.name }))
			await invalidateAll()
			await goto('/')
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

	const deleteBase = () => {
		$deleteBaseMutation.mutate({
			id: $currentBaseId,
		})
	}
</script>

<AlertDialog.Root bind:open={$confirmDeleteBase}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{$t('Delete Base', { ns: 'base' })} ?
			</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>
				{$t('Cancel', { ns: 'common' })}
			</AlertDialog.Cancel>
			<AlertDialog.Action variant="destructive" on:click={deleteBase}>
				{$t('Confirm', { ns: 'common' })}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
