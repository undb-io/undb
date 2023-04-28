<script>
	import { createRecordOpen } from '$lib/store/modal'
	import { P, Button } from 'flowbite-svelte'
	import { t } from '$lib/i18n'
</script>

<div class="flex-1 w-full flex flex-col gap-4 items-center justify-center content-center">
	<P weight="bold">{$t('Create New Record')}</P>

	<Button on:click={() => createRecordOpen.set(true)} class="w-[250px]">{$t('Create New Record')}</Button>
</div>
