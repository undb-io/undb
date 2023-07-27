<script lang="ts">
	import { recordTrashModal } from '$lib/store/modal'
	import { Modal } from 'flowbite-svelte'
	import RecordTrash from './RecordTrash.svelte'
	import { t } from '$lib/i18n'
	import { getTable } from '$lib/store/table'

	const table = getTable()
</script>

<Modal bind:open={$recordTrashModal.open} class="w-full h-full" title={$table.name.value + ' ' + $t('trash')}>
	<RecordTrash />
</Modal>
