<script lang="ts">
	import { getView } from '$lib/store/table'
	import KanbanSelectField from './KanbanSelectField.svelte'
	import KanbanView from './KanbanView.svelte'

	const view = getView()

	$: fieldId = $view.kanbanFieldIdString
</script>

{#if fieldId}
	<KanbanView {fieldId} />
{:else}
	<KanbanSelectField />
{/if}
