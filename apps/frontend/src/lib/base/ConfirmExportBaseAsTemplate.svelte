<script lang="ts">
	import Button from '$components/ui/button/button.svelte'
	import * as Dialog from '$lib/components/ui/dialog'
	import { t } from '$lib/i18n'
	import { confirmExportBaseTemplate } from '$lib/store/modal'
	import { currentBase } from '$lib/store/table'
	import { toast } from 'svelte-sonner'

	const exportTemplate = async () => {
		if (!$currentBase) return

		const res = await fetch(`/api/templates/export/bases/${$currentBase.id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		})

		if (!res.ok) return

		confirmExportBaseTemplate.close()

		toast.success($t('BASE.EXPORTED', { ns: 'success', name: $currentBase.name }))

		const blob = await res.blob()
		const a = document.createElement('a')
		a.href = window.URL.createObjectURL(blob)
		a.download = $currentBase.name
		a.click()
		a.remove()
	}
</script>

<Dialog.Root bind:open={$confirmExportBaseTemplate.open}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				{$t('Export Base Template', { ns: 'base' })}?
			</Dialog.Title>
		</Dialog.Header>

		<Dialog.Footer>
			<div class="flex items-center justify-end gap-2">
				<Button on:click={confirmExportBaseTemplate.close} variant="ghost">
					{$t('Cancel', { ns: 'common' })}
				</Button>
				<Button on:click={exportTemplate}>
					{$t('Confirm', { ns: 'common' })}
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
