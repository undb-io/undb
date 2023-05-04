<script lang="ts">
	import { t } from '$lib/i18n'
	import { configViewOpen } from '$lib/store/modal'
	import { getTable, getView } from '$lib/store/table'
	import { Button } from 'flowbite-svelte'

	const view = getView()
	const table = getTable()
	$: fieldId = $view.kanbanFieldIdString
	$: field = fieldId ? $table.schema.getFieldById(fieldId).into() : undefined
</script>

{#if field}
	<Button color="alternative" size="xs" class="text-xs gap-2" on:click={() => ($configViewOpen = true)}>
		<i class="ti ti-select" />
		<span class="whitespace-nowrap">{$t('Using Field', { name: field.name.value })}</span>
	</Button>
{/if}
