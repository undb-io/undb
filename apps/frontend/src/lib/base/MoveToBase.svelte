<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { moveToBaseModal } from '$lib/store/modal'
	import { getBaseById, getTable } from '$lib/store/table'
	import { moveToBaseSchema, type IMoveToBaseSchema } from '@undb/core'
	import BasePicker from './BasePicker.svelte'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'
	import { invalidateAll } from '$app/navigation'
	import { toast } from 'svelte-sonner'

	const table = getTable()

	let baseId: string | undefined

	$: input = { tableId: $table.id.value, baseId }
	$: valid = moveToBaseSchema.safeParse(input).success

	const moveToBaseMutation = trpc().base.moveToBase.mutation({
		async onSuccess(data, variables, context) {
			if (!baseId) return
			const base = $getBaseById(baseId)
			toast.success($t('TABLE.MOVED_TO_BASE', { ns: 'success', tableName: $table.name.value, baseName: base?.name }))
			await invalidateAll()
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

	const moveToBase = () => {
		if (!valid) return
		$moveToBaseMutation.mutate(input as IMoveToBaseSchema)
	}
</script>

<AlertDialog.Root bind:open={$moveToBaseModal.open}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{$t('Select Base', { ns: 'base' })}
			</AlertDialog.Title>
		</AlertDialog.Header>

		<div>
			<BasePicker bind:enabled={$moveToBaseModal.open} bind:value={baseId} class="w-full" />
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
