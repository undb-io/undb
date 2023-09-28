<script lang="ts">
	import { invalidate, goto } from '$app/navigation'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { t } from '$lib/i18n'
	import { confirmDuplicateView } from '$lib/store/modal'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { ViewVO } from '@undb/core'
	import { tick } from 'svelte'

	const table = getTable()
	export let view: ViewVO

	const duplicate = trpc().table.view.duplicate.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			await tick()
			goto(`/t/${$table.id.value}/${$table.viewsOrder.last}`)
		},
	})

	const duplicateView = async () => {
		$duplicate.mutate({
			tableId: $table.id.value,
			id: view.id.value,
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
