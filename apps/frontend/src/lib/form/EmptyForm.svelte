<script lang="ts">
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { formDrawerMode } from '$lib/store/drawer'
	import { Button } from '$components/ui/button'
</script>

<div class="flex flex-col items-center justify-center gap-4">
	{#if $hasPermission('table:create_form')}
		<p class="font-bold dark:text-white">{$t('Create New Form')}</p>

		<Button on:click={() => ($formDrawerMode = 'create')} class="w-[250px]">{$t('Create New Form')}</Button>
	{:else}
		<!-- else content here -->
	{/if}
</div>
