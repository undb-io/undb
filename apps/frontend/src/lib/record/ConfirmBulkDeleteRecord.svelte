<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { confirmBulkDeleteRecords } from '$lib/store/modal'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'
	import { getTable } from '$lib/store/table'
	import { recordSelection, selectedRecords } from '$lib/store/record'

	const table = getTable()

	const bulkDeleteRecordsMutation = trpc().record.bulkDelete.mutation({
		async onSuccess(data, variables, context) {
			recordSelection.set({})
		},
	})

	const bulkDeleteRecords = async () => {
		if (!$selectedRecords.length) {
			return
		}

		$bulkDeleteRecordsMutation.mutate({
			tableId: $table.id.value,
			ids: $selectedRecords as [string, ...string[]],
		})
		$confirmBulkDeleteRecords = false
	}
</script>

<AlertDialog.Root bind:open={$confirmBulkDeleteRecords}>
	<AlertDialog.Content class="z-[999999999]">
		<AlertDialog.Header>
			<AlertDialog.Title>{$t('Confirm Delete Record')}</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel
				on:click={() => {
					confirmBulkDeleteRecords.set(false)
				}}
			>
				{$t('Confirm No', { ns: 'common' })}
			</AlertDialog.Cancel>
			<AlertDialog.Action variant="destructive" on:click={bulkDeleteRecords}>
				{$t('Confirm Yes', { ns: 'common' })}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
