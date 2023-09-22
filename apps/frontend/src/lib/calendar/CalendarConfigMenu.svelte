<script lang="ts">
	import { t } from '$lib/i18n'
	import { configViewModal } from '$lib/store/modal'
	import { getTable, getView } from '$lib/store/table'
	import { Button } from '$lib/components/ui/button'

	const view = getView()
	const table = getTable()
	$: fieldId = $view.calendarFieldIdString
	$: field = fieldId ? $table.schema.getFieldById(fieldId).into() : undefined
</script>

{#if field}
	<Button variant="ghost" size="sm" class="text-xs gap-2" on:click={() => configViewModal.open()}>
		<i class="ti ti-select" />
		<span class="whitespace-nowrap">{$t('Using Field', { name: field.name.value })}</span>
	</Button>
{/if}
