<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { selectTableMoveToBaseModal } from '$lib/store/modal'
	import { currentBaseId } from '$lib/store/table'
	import { moveToBaseSchema, type IMoveToBaseSchema } from '@undb/core'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'
	import TablePicker from '$lib/field/FieldInputs/TablePicker.svelte'
	import { invalidate } from '$app/navigation'

	let tableId: string | undefined

	$: input = { tableId, baseId: $currentBaseId }
	$: valid = moveToBaseSchema.safeParse(input).success

	const moveToBaseMutation = trpc().base.moveToBase.mutation({
		async onSuccess(data, variables, context) {
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
