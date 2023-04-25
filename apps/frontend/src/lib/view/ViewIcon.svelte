<script lang="ts">
	import type { IViewDisplayType } from '@undb/core'

	export let type: IViewDisplayType

	const map: Record<IViewDisplayType, string> = {
		tree: 'hierarchy',
		grid: 'table',
		kanban: 'layout-kanban',
		calendar: 'calendar',
	}
</script>

<i class={`ti ti-${map[type]} text-sm`} />
