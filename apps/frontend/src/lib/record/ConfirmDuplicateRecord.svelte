<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { confirmDuplicateRecord } from '$lib/store/modal'
	import { t } from '$lib/i18n'
	import { Button } from '$components/ui/button'
	import { trpc } from '$lib/trpc/client'
	import { currentRecordId, getRecord, getTable } from '$lib/store/table'

	const table = getTable()
	const record = getRecord()

	const duplicateRecord = trpc().record.duplicate.mutation({
		async onSuccess(data, variables, context) {
			$currentRecordId = undefined
		},
	})
</script>

<AlertDialog.Root bind:open={$confirmDuplicateRecord} portal={null}>
	<AlertDialog.Content>
		<div class="text-center">
			<AlertDialog.Header>
				<AlertDialog.Title>
					{$t('Confirm Duplicate Record')}
				</AlertDialog.Title>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel on:click={() => ($confirmDuplicateRecord = false)}>
					{$t('Cancel', { ns: 'common' })}
				</AlertDialog.Cancel>
				<AlertDialog.Action
					class="mr-2 gap-2 whitespace-nowrap"
					disabled={$duplicateRecord.isLoading}
					on:click={() => {
						if ($record) {
							$duplicateRecord.mutate({ tableId: $table.id.value, id: $record.id.value })
						}
					}}
				>
					{#if $duplicateRecord.isLoading}
						<i class="ti ti-rotate animate-spin"></i>
					{:else}
						<i class="ti ti-circle-check text-sm" />
					{/if}
					{$t('Confirm', { ns: 'common' })}
				</AlertDialog.Action>
			</AlertDialog.Footer>
		</div>
	</AlertDialog.Content>
</AlertDialog.Root>
