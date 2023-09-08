<script lang="ts">
	import { cn } from '$lib/utils'
	import type { IViewDisplayType } from '@undb/core'

	export let type: IViewDisplayType

	const map: Record<IViewDisplayType, string> = {
		tree: 'hierarchy',
		grid: 'table-filled',
		kanban: 'layout-kanban',
		gallery: 'album',
		gantt: 'timeline',
		calendar: 'calendar-event',
		dashboard: 'layout-dashboard',
	}

	const colors: Record<IViewDisplayType, string> = {
		tree: 'text-green-500',
		grid: 'text-sky-500',
		kanban: 'text-orange-500',
		gallery: 'text-yellow-500',
		gantt: 'text-fuchsia-500',
		calendar: 'text-green-500',
		dashboard: 'text-cyan-500',
	}
</script>

<i class={cn(`ti ti-${map[type]} text-sm`, colors[type], $$restProps.class)} />
