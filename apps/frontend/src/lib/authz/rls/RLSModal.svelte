<script lang="ts">
	import { rlsModal } from '$lib/store/modal'
	import { Modal } from 'flowbite-svelte'
	import RLS from './RLS.svelte'
	import { t } from '$lib/i18n'
</script>

<Modal bind:open={$rlsModal.open} class="w-full" title={$t('rls', { ns: 'authz' })} placement="top-center" size="lg">
	<RLS />
</Modal>
