<script lang="ts">
	import cx from 'classnames'
	import type { ChartVisualization, IFieldType } from '@undb/core'
	import { trpc } from '$lib/trpc/client'
	import { getTable, getView } from '$lib/store/table'
	import EmptyChartVisualization from './EmptyChartVisualization.svelte'
	import type { ComponentType } from 'svelte'
	import SelectChartVisualization from './SelectChartVisualization.svelte'
	import CollaboraotChartVisualization from './CollaboraotChartVisualization.svelte'

	export let visualization: ChartVisualization

	const table = getTable()
	const view = getView()

	$: fieldId = visualization.fieldId?.value
	$: field = fieldId ? $table.schema.getFieldById(fieldId).into() : undefined

	const getChartData = trpc().table.aggregate.chart.query(
		{
			tableId: $table.id.value,
			viewId: $view.id.value,
			visualizationId: visualization.id.value,
		},
		{
			queryHash: visualization.id.value,
		},
	)

	const map: Partial<Record<IFieldType, ComponentType>> = {
		select: SelectChartVisualization,
		collaborator: CollaboraotChartVisualization,
		'created-by': CollaboraotChartVisualization,
		'updated-by': CollaboraotChartVisualization,
	}
</script>

{#if !fieldId}
	<EmptyChartVisualization {...$$restProps} />
{:else if $getChartData.isLoading}
	<div class="w-full h-full animate-pulse bg-slate-100" />
{:else if field}
	{#key field}
		<div {...$$restProps} class={cx('text-center flex items-center justify-center w-[70%]', $$restProps.class)}>
			<svelte:component this={map[field.type]} {field} data={$getChartData.data?.data} />
		</div>
	{/key}
{/if}
