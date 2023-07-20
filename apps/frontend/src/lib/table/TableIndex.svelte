<script lang="ts">
	import { getView } from '$lib/store/table'
	import type { IViewDisplayType } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import TableView from './TableView.svelte'
	import KanbanIndex from './KanbanIndex.svelte'
	import CalendarIndex from '$lib/calendar/CalendarIndex.svelte'
	import DashboardIndex from '$lib/dashboard/DashboardIndex.svelte'
	import TreeIndex from '$lib/tree/TreeIndex.svelte'
	import GanttIndex from '$lib/gantt/GanttIndex.svelte'
	import GalleryIndex from '$lib/gallery/GalleryIndex.svelte'

	const view = getView()

	$: displayType = $view.displayType

	const map: Partial<Record<IViewDisplayType, ComponentType>> = {
		grid: TableView,
		kanban: KanbanIndex,
		gallery: GalleryIndex,
		gantt: GanttIndex,
		tree: TreeIndex,
		calendar: CalendarIndex,
		dashboard: DashboardIndex,
	}
</script>

<svelte:component this={map[displayType]} />
