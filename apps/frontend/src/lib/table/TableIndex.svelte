<script lang="ts">
	import { getView } from '$lib/store/table'
	import type { IViewDisplayType, Records } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import TableView from './TableView.svelte'
	import KanbanIndex from './KanbanIndex.svelte'
	import CalendarIndex from '$lib/calendar/CalendarIndex.svelte'

	const view = getView()

	$: displayType = $view.displayType

	const map: Partial<Record<IViewDisplayType, ComponentType>> = {
		grid: TableView,
		kanban: KanbanIndex,
		calendar: CalendarIndex,
	}
</script>

<svelte:component this={map[displayType]} />
