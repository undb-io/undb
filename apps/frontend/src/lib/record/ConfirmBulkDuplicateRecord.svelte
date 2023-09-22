<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { confirmBulkDuplicateRecords } from '$lib/store/modal'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'
	import { getTable } from '$lib/store/table'
	import { recordSelection, selectedRecords } from '$lib/store/record'

	const table = getTable()

	const bulkDuplicateRecordsMutation = trpc().record.bulkDuplicate.mutation({
		async onSuccess(data, variables, context) {
			recordSelection.reset()
		},
	})

	const duplicate = () => {
		$bulkDuplicateRecordsMutation.mutate({
			tableId: $table.id.value,
			ids: $selectedRecords as [string, ...string[]],
		})
	}
</script>

<AlertDialog.Root bind:open={$confirmBulkDuplicateRecords}>
	<AlertDialog.Content class="z-[999999999]">
		<AlertDialog.Header>
			<AlertDialog.Title>{$t('Confirm Duplicate Record')}</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel
				on:click={() => {
					confirmBulkDuplicateRecords.set(false)
				}}
			>
				{$t('Cancel', { ns: 'common' })}
			</AlertDialog.Cancel>
			<AlertDialog.Action on:click={duplicate}>
				{$t('Confirm', { ns: 'common' })}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
