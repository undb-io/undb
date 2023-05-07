<script lang="ts">
	import { getView } from '$lib/store/table'
	import type { IViewDisplayType } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import TableToolBarControls from '../table/TableToolBarControls.svelte'

	const view = getView()

	$: type = $view.displayType

	const map: Partial<Record<IViewDisplayType, ComponentType>> = {
		grid: TableToolBarControls,
	}
</script>

<svelte:component this={map[type]} />
