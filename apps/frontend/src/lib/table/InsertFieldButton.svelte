<script lang="ts">
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { createFieldModal } from '$lib/store/modal'
	import { Tooltip } from 'flowbite-svelte'
	import { Button } from '$components/ui/button'
</script>

{#if $hasPermission('table:create_field')}
	<Button
		on:click={() => createFieldModal.open()}
		size="sm"
		color="alternative"
		class=" w-8 px-0 inline-flex items-center whitespace-nowrap transition  dark:hover:bg-gray-800 border-gray-200 text-gray-900 dark:text-gray-50 dark:border-gray-400  border bg-[unset] hover:text-primary hover:bg-gray-100"
	>
		<i class="ti ti-column-insert-right text-sm dark:text-gray-200" />
	</Button>
	<Tooltip class="z-50" placement="bottom">{$t('Insert Field Right')}</Tooltip>
{/if}
