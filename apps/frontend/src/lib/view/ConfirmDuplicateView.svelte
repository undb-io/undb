<script lang="ts">
	import { invalidate, goto } from '$app/navigation'
	import { Input } from '$components/ui/input'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { t } from '$lib/i18n'
	import { confirmDuplicateView } from '$lib/store/modal'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { ViewVO } from '@undb/core'

	const table = getTable()
	export let view: ViewVO

	const duplicate = trpc().table.view.duplicate.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			await goto(`/t/${$table.id.value}/${$table.viewsOrder.last}`)
		},
	})

	let name = view.name.value

	const duplicateView = async () => {
		$duplicate.mutate({
			tableId: $table.id.value,
			id: view.id.value,
			name,
		})
	}
</script>

<AlertDialog.Root bind:open={$confirmDuplicateView}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{$t('Confirm Duplicate View', { name: view.name.value })}
			</AlertDialog.Title>
		</AlertDialog.Header>

		<Input bind:value={name} />

		<AlertDialog.Footer>
			<AlertDialog.Cancel>
				{$t('Cancel', { ns: 'common' })}
			</AlertDialog.Cancel>
			<AlertDialog.Action on:click={duplicateView}>
				{$t('Confirm', { ns: 'common' })}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
