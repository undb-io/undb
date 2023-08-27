<script lang="ts">
	import { flsModal } from '$lib/store/modal'
	import { Modal } from 'flowbite-svelte'
	import FLS from './FLS.svelte'
	import { t } from '$lib/i18n'
</script>

<Modal bind:open={$flsModal.open} class="w-full" title={$t('fls', { ns: 'authz' })} placement="top-center" size="xl">
	<FLS />
</Modal>
