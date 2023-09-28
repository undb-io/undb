<script lang="ts">
	import { invalidateAll, goto } from '$app/navigation'
	import * as AlertDialog from '$components/ui/alert-dialog'
	import { t } from '$lib/i18n'
	import { confirmDeleteTable, updateTableModal } from '$lib/store/modal'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { Table } from '@undb/core'
	import { toast } from 'svelte-sonner'

	const table = getTable()

	const deleteTable = trpc().table.delete.mutation({
		async onSuccess(data, variables, context) {
			toast.success($t('TABLE.DELETED', { ns: 'success', name: $table.name.value }))
			await invalidateAll()
			await goto('/')
			updateTableModal.close()
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})
</script>

<AlertDialog.Root bind:open={$confirmDeleteTable}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{$t('Confirm Delete Table', { table: $table.name.value })}</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel
				on:click={() => {
					$confirmDeleteTable = false
				}}
			>
				{$t('Confirm No', { ns: 'common' })}
			</AlertDialog.Cancel>
			<AlertDialog.Action
				class="gap-2"
				variant="destructive"
				disabled={$deleteTable.isLoading}
				on:click={() => {
					$deleteTable.mutate({ id: $table.id.value })
				}}
			>
				{#if $deleteTable.isLoading}
					<i class="ti ti-rotate animate-spin"></i>
				{:else}
					<i class="ti ti-circle-check text-lg" />
				{/if}
				{$t('Confirm Yes', { ns: 'common' })}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
