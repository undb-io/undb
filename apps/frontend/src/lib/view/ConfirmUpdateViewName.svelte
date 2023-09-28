<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { Input } from '$components/ui/input'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { t } from '$lib/i18n'
	import { confirmUpdateViewName } from '$lib/store/modal'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { ViewName, type ViewVO } from '@undb/core'

	const table = getTable()
	export let view: ViewVO

	let name = view.name.value

	const updateName = trpc().table.view.updateName.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			view.name = new ViewName({ value: name })
		},
	})
	const update = async () => {
		$updateName.mutate({
			tableId: $table.id.value,
			view: {
				id: view.id.value,
				name,
			},
		})
	}
</script>

<AlertDialog.Root bind:open={$confirmUpdateViewName}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{$t('Update View Name')}
			</AlertDialog.Title>
		</AlertDialog.Header>

		<Input bind:value={name} />

		<AlertDialog.Footer>
			<AlertDialog.Cancel>
				{$t('Cancel', { ns: 'common' })}
			</AlertDialog.Cancel>
			<AlertDialog.Action on:click={update}>
				{$t('Confirm', { ns: 'common' })}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
