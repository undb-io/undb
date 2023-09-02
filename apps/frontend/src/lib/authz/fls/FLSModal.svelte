<script lang="ts">
	import { flsModal } from '$lib/store/modal'
	import FLS from './FLS.svelte'
	import { t } from '$lib/i18n'
	import * as Dialog from '$lib/components/ui/dialog'
</script>

<Dialog.Root bind:open={$flsModal.open}>
	<Dialog.Content class="!w-1/3 !max-w-none">
		<Dialog.Header>
			<Dialog.Title>{$t('fls', { ns: 'authz' })}</Dialog.Title>
		</Dialog.Header>
		<FLS />
	</Dialog.Content>
</Dialog.Root>
