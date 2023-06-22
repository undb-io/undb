<script lang="ts">
	// @ts-ignore
	import Grid from 'svelte-grid'
	import { trpc } from '$lib/trpc/client'
	import { dashboardWidgets, getTable, getView } from '$lib/store/table'
	import type { IRelayoutWidgetSchema } from '@undb/core'
	import { invalidate } from '$app/navigation'
	import WidgetItem from './WidgetItem.svelte'
	import { COLS, widgetItems } from '$lib/store/widget'
	import EmptyDashboard from './EmptyDashboard.svelte'

	const table = getTable()
	const view = getView()

	$: $view, widgetItems.init($dashboardWidgets)

	const cols = [[1200, COLS]]

	const relayoutWidgets = trpc().table.view.dashboard.relayoutWidgets.mutation({
		async onSuccess() {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const onPointeup = () => {
		const widgets: IRelayoutWidgetSchema[] = $widgetItems.map((item) => {
			const { x, y, h, w } = item[COLS]
			const layout = { x, y, h, w }
			return { id: item.id, layout }
		})

		$relayoutWidgets.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			widgets,
		})
	}
</script>

<div class="w-full h-full">
	{#if !$widgetItems.length}
		<div class="w-full h-full flex items-center justify-center">
			<EmptyDashboard />
		</div>
	{:else}
		<Grid
			bind:items={$widgetItems}
			rowHeight={100}
			let:dataItem
			{cols}
			fastStart
			let:movePointerDown
			let:resizePointerDown
			on:pointerup={onPointeup}
			fillSpace
		>
			<WidgetItem {dataItem} {movePointerDown} {resizePointerDown} />
		</Grid>
	{/if}
</div>

<style>
	:global(.svlt-grid-shadow) {
		/* Back shadow */
		background: #dbeafe !important;
		opacity: 0.5;
		border: 2px #2563eb dashed;
		border-radius: 4px;
	}

	:global(.svlt-grid-item) {
		opacity: 1 !important;
	}
</style>
