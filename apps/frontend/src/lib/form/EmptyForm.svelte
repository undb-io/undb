<script lang="ts">
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { formDrawerMode } from '$lib/store/drawer'
	import { Button, P } from 'flowbite-svelte'
</script>

<div class="flex flex-col items-center justify-center gap-4">
	{#if $hasPermission('table:create_form')}
		<P weight="bold">{$t('Create New Form')}</P>

		<Button on:click={() => ($formDrawerMode = 'create')} class="w-[250px]">{$t('Create New Form')}</Button>
	{:else}
		<!-- else content here -->
	{/if}
</div>
