<script lang="ts">
	import { t } from '$lib/i18n'
	import { inviteModal } from '$lib/store/modal'
	import Invite from './Invite.svelte'
	import * as Dialog from '$lib/components/ui/dialog'
</script>

<Dialog.Root bind:open={$inviteModal.open}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$t('invite', { ns: 'common' })}</Dialog.Title>
		</Dialog.Header>

		<Invite />
	</Dialog.Content>
</Dialog.Root>
