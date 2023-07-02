<script lang="ts">
	import { Modal } from 'flowbite-svelte'
	import Erd from './Erd.svelte'
	import { erdModal } from '$lib/store/modal'
	import { t } from '$lib/i18n'
</script>

<div id="erd-modal">
	<Modal
		bind:open={$erdModal.open}
		class="w-full h-[calc(100vh-64px)] shadow-xl rounded-lg dark:bg-gray-800 "
		size="xl"
		title={$t('ERD')}
		shadow
	>
		<Erd />
	</Modal>
</div>

<style>
	:global(#erd-modal .max-w-7xl) {
		max-width: 100%;
	}

	:global(.dark #background-wrapper) {
		background-color: #e8e8e9dc !important;
	}
</style>
