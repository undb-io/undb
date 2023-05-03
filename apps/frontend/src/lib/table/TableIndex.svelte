<script lang="ts">
	import { getView } from '$lib/store/table'
	import type { IViewDisplayType, Records } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import TableView from './TableView.svelte'
	import KanbanIndex from './KanbanIndex.svelte'

	const view = getView()

	$: displayType = $view.displayType

	const map: Record<IViewDisplayType, ComponentType> = {
		grid: TableView,
		kanban: KanbanIndex,
		calendar: TableView,
		tree: TableView,
	}
</script>

<svelte:component this={map[displayType]} />
