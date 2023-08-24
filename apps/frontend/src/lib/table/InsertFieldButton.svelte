<script lang="ts">
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { createFieldModal } from '$lib/store/modal'
	import { Tooltip } from 'flowbite-svelte'
	import { Button } from '$components/ui/button'
</script>

{#if $hasPermission('table:create_field')}
	<Button on:click={() => createFieldModal.open()} size="sm" variant="secondary">
		<i class="ti ti-column-insert-right text-sm dark:text-gray-200" />
	</Button>
	<Tooltip class="z-50" placement="bottom">{$t('Insert Field Right')}</Tooltip>
{/if}
