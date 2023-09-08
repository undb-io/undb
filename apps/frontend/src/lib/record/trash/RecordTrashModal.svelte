<script lang="ts">
	import { recordTrashModal } from '$lib/store/modal'
	import RecordTrash from './RecordTrash.svelte'
	import { t } from '$lib/i18n'
	import { getTable } from '$lib/store/table'
	import * as Dialog from '$lib/components/ui/dialog'

	const table = getTable()
</script>

<Dialog.Root bind:open={$recordTrashModal.open}>
	<Dialog.Content class="!w-1/2 !max-w-none h-3/4 overflow-y-auto flex flex-col gap-2">
		<Dialog.Header>
			<Dialog.Title>{$table.name.value + ' ' + $t('trash')}</Dialog.Title>
		</Dialog.Header>
		<RecordTrash />
	</Dialog.Content>
</Dialog.Root>
