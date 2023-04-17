<script lang="ts">
	import { IconCalendar, IconHierarchy, IconLayoutKanban, IconTable, type IconProps } from '@tabler/icons-svelte'
	import type { IViewDisplayType } from '@undb/core'
	import type { ComponentType } from 'svelte'

	export let type: IViewDisplayType

	const map: Record<IViewDisplayType, ComponentType> = {
		tree: IconHierarchy,
		grid: IconTable,
		kanban: IconLayoutKanban,
		calendar: IconCalendar,
	}
</script>

<svelte:component this={map[type]} size="16" />
