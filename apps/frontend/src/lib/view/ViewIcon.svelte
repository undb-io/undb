<script lang="ts">
	import cx from 'classnames'
	import type { IViewDisplayType } from '@undb/core'

	export let type: IViewDisplayType

	const map: Record<IViewDisplayType, string> = {
		tree: 'hierarchy',
		grid: 'table-filled',
		kanban: 'layout-kanban',
		calendar: 'calendar-event',
	}

	const colors: Record<IViewDisplayType, string> = {
		tree: 'text-green-500',
		grid: 'text-sky-500',
		kanban: 'text-orange-500',
		calendar: 'text-green-500',
	}
</script>

<i class={cx(`ti ti-${map[type]} text-sm`, colors[type], $$restProps.class)} />
