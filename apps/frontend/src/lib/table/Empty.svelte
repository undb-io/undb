<script>
	import { P, Button } from 'flowbite-svelte'
	import { t } from '$lib/i18n'
	import { createTableModal } from '$lib/store/modal'
</script>

<div class="h-full w-full flex flex-col gap-4 items-center justify-center content-center">
	<P weight="bold">{$t('Create New Table')}</P>

	<p class="inline-flex items-center">{@html $t('shortcut T', { shortcut: 'T' })}</p>

	<Button class="w-[250px]" on:click={() => createTableModal.open()}>{$t('Create New Table')}</Button>
</div>
