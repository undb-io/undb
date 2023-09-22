<script lang="ts">
	import { rlsModal } from '$lib/store/modal'
	import RLS from './RLS.svelte'
	import { t } from '$lib/i18n'
	import * as Dialog from '$components/ui/dialog'
</script>

<Dialog.Root bind:open={$rlsModal.open}>
	<Dialog.Content class="!w-1/2 max-w-none max-h-[98%] overflow-y-auto bg-white dark:bg-gray-800">
		<Dialog.Header>
			<Dialog.Title>
				{$t('rls', { ns: 'authz' })}
			</Dialog.Title>
		</Dialog.Header>
		<RLS />
	</Dialog.Content>
</Dialog.Root>
