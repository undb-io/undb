<script lang="ts">
	import { Modal } from 'flowbite-svelte'
	import Erd from './Erd.svelte'
	import { erdModal } from '$lib/store/modal'
	import { t } from '$lib/i18n'
</script>

<Modal bind:open={$erdModal.open} class="w-full h-screen" size="xl" title={$t('ERD')}>
	<Erd />
</Modal>
