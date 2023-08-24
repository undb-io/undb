<script lang="ts">
	import { t } from '$lib/i18n'
	import { inviteModal } from '$lib/store/modal'
	import { Button } from '$lib/components/ui/button'
</script>

<Button class="w-36" on:click={() => inviteModal.open()}>
	{$t('invite', { ns: 'common' })}
</Button>
