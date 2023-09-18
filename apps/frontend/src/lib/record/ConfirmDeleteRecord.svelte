<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { confirmDeleteRecord } from '$lib/store/modal'
	import { t } from '$lib/i18n'
	import { Button } from '$components/ui/button'
	import { trpc } from '$lib/trpc/client'
	import { currentRecordId, getRecord, getTable } from '$lib/store/table'

	const table = getTable()
	const record = getRecord()

	const deleteRecord = trpc().record.delete.mutation({
		async onSuccess(data, variables, context) {
			$currentRecordId = undefined
			await goto($page.url.pathname)
		},
	})
</script>

<AlertDialog.Root bind:open={$confirmDeleteRecord} portal={null}>
	<AlertDialog.Content>
		<div class="text-center">
			<svg
				aria-hidden="true"
				class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-200">
				{$t('Confirm Delete Record')}
			</h3>
			<AlertDialog.Footer>
				<Button variant="secondary" on:click={() => ($confirmDeleteRecord = false)}>
					{$t('Confirm No', { ns: 'common' })}
				</Button>
				<Button
					variant="destructive"
					class="mr-2 gap-2 whitespace-nowrap"
					disabled={$deleteRecord.isLoading}
					on:click={() => {
						if ($record) {
							$deleteRecord.mutate({ tableId: $table.id.value, id: $record.id.value })
						}
					}}
				>
					{#if $deleteRecord.isLoading}
						<i class="ti ti-rotate animate-spin"></i>
					{:else}
						<i class="ti ti-circle-check text-sm" />
					{/if}
					{$t('Confirm Yes', { ns: 'common' })}</Button
				>
			</AlertDialog.Footer>
		</div>
	</AlertDialog.Content>
</AlertDialog.Root>
