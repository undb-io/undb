<script lang="ts">
	// @ts-ignore
	import Grid from 'svelte-grid'
	import { trpc } from '$lib/trpc/client'
	import { dashboardWidges, getTable, getView } from '$lib/store/table'
	import type { IRelayoutWidgeSchema } from '@undb/core'
	import { invalidate } from '$app/navigation'
	import WidgeItem from './WidgeItem.svelte'
	import { COLS, widgeItems } from '$lib/store/widge'
	import EmptyDashboard from './EmptyDashboard.svelte'

	const table = getTable()
	const view = getView()

	$: $view, widgeItems.init($dashboardWidges)

	const cols = [[1200, COLS]]

	const relayoutWidges = trpc().table.view.dashboard.relayoutWidges.mutation({
		async onSuccess() {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const onPointeup = () => {
		const widges: IRelayoutWidgeSchema[] = $widgeItems.map((item) => {
			const { x, y, h, w } = item[COLS]
			const layout = { x, y, h, w }
			return { id: item.id, layout }
		})

		$relayoutWidges.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			widges,
		})
	}
</script>

<div class="w-full h-full">
	{#if !$widgeItems.length}
		<div class="w-full h-full flex items-center justify-center">
			<EmptyDashboard />
		</div>
	{:else}
		<Grid
			bind:items={$widgeItems}
			rowHeight={100}
			let:dataItem
			{cols}
			fastStart
			let:movePointerDown
			let:resizePointerDown
			on:pointerup={onPointeup}
			fillSpace
		>
			<WidgeItem {dataItem} {movePointerDown} {resizePointerDown} />
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
