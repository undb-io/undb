<script lang="ts">
	import { flsModal } from '$lib/store/modal'
	import FLS from './FLS.svelte'
	import { t } from '$lib/i18n'
	import * as Dialog from '$lib/components/ui/dialog'
</script>

<Dialog.Root bind:open={$flsModal.open}>
	<Dialog.Content class="!w-1/2 !max-w-none bg-white dark:bg-gray-800">
		<Dialog.Header>
			<Dialog.Title>{$t('fls', { ns: 'authz' })}</Dialog.Title>
		</Dialog.Header>
		<FLS />
	</Dialog.Content>
</Dialog.Root>
