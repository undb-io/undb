<script lang="ts">
	import { t } from '$lib/i18n'
	import { webhookDrawerMode } from '$lib/store/drawer'
	import { Button, P } from 'flowbite-svelte'
</script>

<div class="flex flex-col items-center justify-center gap-4">
	<P weight="bold">{$t('Create New Webhook')}</P>

	<Button on:click={() => ($webhookDrawerMode = 'create')} class="w-[250px]">{$t('Create New Webhook')}</Button>
</div>
