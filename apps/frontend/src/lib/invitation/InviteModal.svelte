<script lang="ts">
	import { Modal } from 'flowbite-svelte'
	import { t } from '$lib/i18n'
	import { inviteModal } from '$lib/store/modal'
	import Invite from './Invite.svelte'
</script>

<Modal bind:open={$inviteModal.open} class="w-full" title={$t('invite', { ns: 'common' })} placement="top-center">
	<Invite />
</Modal>
