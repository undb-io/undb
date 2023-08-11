<script lang="ts">
	import { t } from '$lib/i18n'
	import { configViewModal } from '$lib/store/modal'
	import { getTable, getView } from '$lib/store/table'
	import { Button } from 'flowbite-svelte'
	import { hasPermission } from '$lib/store/authz'

	const view = getView()
	const table = getTable()
	$: fieldId = $view.kanbanFieldIdString
	$: field = fieldId ? $table.schema.getFieldById(fieldId).into() : undefined
</script>

{#if field && $hasPermission('record:create')}
	<Button
		color="alternative"
		size="xs"
		class="text-xs gap-2 dark:hover:bg-gray-800 dark:text-gray-200 dark:border-gray-400"
		on:click={() => configViewModal.open()}
	>
		<i class="ti ti-select" />
		<span class="whitespace-nowrap">{$t('Using Field', { name: field.name.value })}</span>
	</Button>
{/if}
