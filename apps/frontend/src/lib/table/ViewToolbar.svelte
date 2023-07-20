<script lang="ts">
	import { getView } from '$lib/store/table'
	import type { IViewDisplayType } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import GridToolbar from './GridToolbar.svelte'
	import KanbanToolbar from './KanbanToolbar.svelte'
	import CalendarToolbar from './CalendarToolbar.svelte'
	import DashboardToolbar from './DashboardToolbar.svelte'
	import TreeToolbar from './TreeToolbar.svelte'
	import GanttToolbar from '$lib/gantt/GanttToolbar.svelte'
	import GalleryToolbar from '$lib/gallery/GalleryToolbar.svelte'

	const view = getView()
	$: type = $view.displayType

	const map: Partial<Record<IViewDisplayType, ComponentType>> = {
		grid: GridToolbar,
		kanban: KanbanToolbar,
		gallery: GalleryToolbar,
		gantt: GanttToolbar,
		calendar: CalendarToolbar,
		dashboard: DashboardToolbar,
		tree: TreeToolbar,
	}
</script>

<svelte:component this={map[type]} />
