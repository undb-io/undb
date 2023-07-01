<script lang="ts">
	import { Modal } from 'flowbite-svelte'
	import Erd from './Erd.svelte'
	import { erdModal } from '$lib/store/modal'
	import { t } from '$lib/i18n'
</script>

<div id="erd-modal">
	<Modal bind:open={$erdModal.open} class="w-full h-[calc(100vh-64px)]" size="xl" title={$t('ERD')}>
		<Erd />
	</Modal>
</div>

<style>
	:global(#erd-modal .max-w-7xl) {
		max-width: 100%;
	}
</style>
