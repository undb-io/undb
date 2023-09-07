<script>
	import { createRecordModal } from '$lib/store/modal'
	import { Button } from '$lib/components/ui/button'
	import { t } from '$lib/i18n'
</script>

<div class="flex-1 w-full flex flex-col gap-4 items-center justify-center content-center">
	<p class="font-bold dark:text-white">{$t('Create New Record')}</p>

	<p class="inline-flex items-center dark:text-gray-100">{@html $t('shortcut R', { shortcut: 'R' })}</p>

	<Button on:click={() => createRecordModal.open()} class="w-[250px]">{$t('Create New Record')}</Button>
</div>
