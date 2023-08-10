<script lang="ts">
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { createFieldModal } from '$lib/store/modal'
	import { Button, Tooltip } from 'flowbite-svelte'
</script>

{#if $hasPermission('table:create_field')}
	<Button
		on:click={() => createFieldModal.open()}
		size="xs"
		color="alternative"
		class="h-full w-8 px-0 !rounded-md inline-flex items-center whitespace-nowrap transition dark:hover:bg-gray-800 dark:border-gray-400"
	>
		<i class="ti ti-column-insert-right text-sm dark:text-gray-200" />
	</Button>
	<Tooltip class="z-50" placement="bottom">{$t('Insert Field Right')}</Tooltip>
{/if}
