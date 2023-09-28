<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { selectTableMoveToBaseModal } from '$lib/store/modal'
	import { currentBaseId, currentBase, tableById } from '$lib/store/table'
	import { moveToBaseSchema, type IMoveToBaseSchema } from '@undb/core'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'
	import TablePicker from '$lib/field/FieldInputs/TablePicker.svelte'
	import { invalidate } from '$app/navigation'
	import { toast } from 'svelte-sonner'

	let tableId: string | undefined

	$: input = { tableId, baseId: $currentBaseId }
	$: valid = moveToBaseSchema.safeParse(input).success

	const moveToBaseMutation = trpc().base.moveToBase.mutation({
		async onSuccess(data, variables, context) {
			if (!tableId) return
			const table = await $tableById(tableId)
			toast.success(
				$t('TABLE.MOVED_TO_BASE', { ns: 'success', tableName: table?.name.value, baseName: $currentBase?.name }),
			)
			await invalidate('baseTables')
		},
	})

	const moveToBase = () => {
		if (!valid) return
		$moveToBaseMutation.mutate(input as IMoveToBaseSchema)
	}
</script>

<AlertDialog.Root bind:open={$selectTableMoveToBaseModal.open}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{$t('move to base', { ns: 'base' })}
			</AlertDialog.Title>
		</AlertDialog.Header>

		<div>
			<TablePicker bind:value={tableId} class="w-full" />
		</div>

		<AlertDialog.Footer>
			<AlertDialog.Cancel>
				{$t('Cancel', { ns: 'common' })}
			</AlertDialog.Cancel>
			<AlertDialog.Action disabled={!valid} on:click={moveToBase}>
				{$t('Confirm', { ns: 'common' })}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
