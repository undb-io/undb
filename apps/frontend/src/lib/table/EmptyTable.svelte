<script>
	import { createRecordModal } from '$lib/store/modal'
	import { P, Button } from 'flowbite-svelte'
	import { t } from '$lib/i18n'
</script>

<div class="flex-1 w-full flex flex-col gap-4 items-center justify-center content-center">
	<P weight="bold">{$t('Create New Record')}</P>

	<p class="inline-flex items-center">{@html $t('shortcut R', { shortcut: 'R' })}</p>

	<Button on:click={() => createRecordModal.open()} class="w-[250px]">{$t('Create New Record')}</Button>
</div>
