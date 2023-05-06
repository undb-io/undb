<script lang="ts">
	import { getView } from '$lib/store/table'
	import type { IViewDisplayType } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import KanbanConfigMenu from './KanbanConfigMenu.svelte'
	import CalendarConfigMenu from '$lib/calendar/CalendarConfigMenu.svelte'

	const view = getView()

	$: type = $view.displayType

	const components: Partial<Record<IViewDisplayType, ComponentType>> = {
		kanban: KanbanConfigMenu,
		calendar: CalendarConfigMenu,
	}
</script>

<svelte:component this={components[type]} />
