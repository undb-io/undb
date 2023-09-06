<script lang="ts">
	import Erd from './Erd.svelte'
	import { erdModal } from '$lib/store/modal'
	import { t } from '$lib/i18n'
	import * as Dialog from '$lib/components/ui/dialog'
</script>

<div id="erd-modal">
	<Dialog.Root bind:open={$erdModal.open}>
		<Dialog.Content class="!w-[90%] !max-w-none h-[98%] block space-y-2">
			<Dialog.Header>
				<Dialog.Title>{$t('ERD')}</Dialog.Title>
			</Dialog.Header>

			<Erd />
		</Dialog.Content>
	</Dialog.Root>
</div>

<style>
	:global(.dark #background-wrapper) {
		background-color: #e8e8e9dc !important;
	}
</style>
