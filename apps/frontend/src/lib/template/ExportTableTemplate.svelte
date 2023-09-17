<script lang="ts">
	import Checkbox from '$components/ui/checkbox/checkbox.svelte'
	import Label from '$components/ui/label/label.svelte'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { t } from '$lib/i18n'
	import { exportTableTemplate } from '$lib/store/modal'
	import { getTable, recordsStore } from '$lib/store/table'

	const table = getTable()

	const records = recordsStore.records

	// TODO: allow user to select records
	$: recordIds = $records.slice(0, 10).map((r) => r.id.value)

	let includeRecords = true

	const exportTemplate = async () => {
		const res = await fetch(`/api/templates/export/tables/${$table.id.value}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				recordIds: includeRecords ? recordIds : undefined,
			}),
		})

		if (!res.ok) return

		const blob = await res.blob()
		const a = document.createElement('a')
		a.href = window.URL.createObjectURL(blob)
		a.download = $table.name.value
		a.click()
		a.remove()
	}
</script>

<AlertDialog.Root bind:open={$exportTableTemplate.open}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{$t('confirm export table template', { tableName: $table.name.value })}
			</AlertDialog.Title>
			<AlertDialog.Description>
				{$t('export table template alert')}
			</AlertDialog.Description>
		</AlertDialog.Header>

		<Label class="flex items-center gap-2">
			<Checkbox bind:checked={includeRecords} />
			<span>{$t('export table includes records')}</span>
		</Label>

		<AlertDialog.Footer>
			<AlertDialog.Cancel>
				{$t('Cancel', { ns: 'common' })}
			</AlertDialog.Cancel>
			<AlertDialog.Action
				on:click={() => {
					exportTemplate()
				}}
			>
				{$t('Confirm', { ns: 'common' })}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
