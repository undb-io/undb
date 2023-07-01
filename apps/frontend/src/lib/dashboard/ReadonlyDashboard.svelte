<script lang="ts">
	import { dashboardWidgets, getView } from '$lib/store/table'
	import { COLS, widgetItems } from '$lib/store/widget'
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	import Grid from 'svelte-grid'
	import WidgetItem from './WidgetItem.svelte'

	const view = getView()
	const cols = [[1200, COLS]]

	$: $view, widgetItems.init($dashboardWidgets)
</script>

<div class="w-full h-full relative">
	<Grid bind:items={$widgetItems} rowHeight={100} let:dataItem {cols} fastStart fillSpace>
		<WidgetItem {dataItem} />
	</Grid>
</div>
