<script lang="ts">
	import Button from '$components/ui/button/button.svelte'
	import * as Dialog from '$lib/components/ui/dialog'
	import { t } from '$lib/i18n'
	import { confirmExportBaseTemplate } from '$lib/store/modal'
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
				<Button>
					{$t('Confirm', { ns: 'common' })}
				</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
