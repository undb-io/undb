<script lang="ts">
	import { getView } from '$lib/context'
	import KanbanSelectField from './KanbanSelectField.svelte'
	import KanbanView from './KanbanView.svelte'

	const view = getView()

	$: field = $view.kanban.into()?.fieldId
</script>

<svelte:component this={!field ? KanbanSelectField : KanbanView} />
