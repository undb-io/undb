<script>
	import { createTableOpen } from '$lib/store/modal'
	import { P, Button } from 'flowbite-svelte'
	import { t } from '$lib/i18n'
</script>

<div class="h-full w-full flex flex-col gap-4 items-center justify-center content-center">
	<P weight="bold">{$t('Create New Table')}</P>

	<p class="inline-flex items-center">{@html $t('shortcut T', { shortcut: 'T' })}</p>

	<Button class="w-[250px]" on:click={() => createTableOpen.set(true)}>{$t('Create New Table')}</Button>
</div>
