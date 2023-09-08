<script lang="ts">
	import { t } from '$lib/i18n'
	import { inviteModal } from '$lib/store/modal'
	import { Button } from '$lib/components/ui/button'
</script>

<Button class="w-36 gap-2" on:click={() => inviteModal.open()}>
	<i class="ti ti-user-plus"></i>
	<span>
		{$t('invite', { ns: 'common' })}
	</span>
</Button>
