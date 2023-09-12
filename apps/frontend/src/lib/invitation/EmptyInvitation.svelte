<script lang="ts">
	import { Button } from '$components/ui/button'
	import { t } from '$lib/i18n'
	import { inviteModal } from '$lib/store/modal'
</script>

<section class="w-full h-full flex flex-col items-center justify-center gap-4 pt-40">
	<h3 class="text-xl font-bold">
		{$t('Create New Invitation', { ns: 'common' })}
	</h3>
	<Button
		class="w-64 gap-2"
		on:click={() => {
			inviteModal.open()
		}}
	>
		<i class="ti ti-user-plus"></i>
		{$t('Create New Invitation', { ns: 'common' })}
	</Button>
</section>
