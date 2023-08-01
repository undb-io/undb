<script lang="ts">
	import { rlsModal } from '$lib/store/modal'
	import { Modal } from 'flowbite-svelte'
	import { t } from '$lib/i18n'
	import { getTable, getView } from '$lib/store/table'
	import RLS from './RLS.svelte'

	const table = getTable()
	const view = getView()
</script>

<Modal bind:open={$rlsModal.open} class="w-full" title="rls" placement="top-center">
	<RLS />
</Modal>
