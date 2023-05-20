<script lang="ts">
	import cx from 'classnames'
	import type { ChartVirsualization, IFieldType } from '@undb/core'
	import { trpc } from '$lib/trpc/client'
	import { getTable, getView } from '$lib/store/table'
	import EmptyChartVirsualization from './EmptyChartVirsualization.svelte'
	import type { ComponentType } from 'svelte'
	import SelectChartVirsualization from './SelectChartVirsualization.svelte'
	import CollaboraotChartVirsualization from './CollaboraotChartVirsualization.svelte'

	export let virsualization: ChartVirsualization

	const table = getTable()
	const view = getView()

	$: fieldId = virsualization.fieldId?.value
	$: field = fieldId ? $table.schema.getFieldById(fieldId).into() : undefined

	const getChartData = trpc().table.aggregate.chart.query(
		{
			tableId: $table.id.value,
			viewId: $view.id.value,
			virsualizationId: virsualization.id.value,
		},
		{
			queryHash: virsualization.id.value,
		},
	)

	const map: Partial<Record<IFieldType, ComponentType>> = {
		select: SelectChartVirsualization,
		collaborator: CollaboraotChartVirsualization,
	}
</script>

{#if !fieldId}
	<EmptyChartVirsualization {...$$restProps} />
{:else if $getChartData.isLoading}
	<div class="w-full h-full animate-pulse bg-slate-100" />
{:else if field}
	{#key field}
		<div {...$$restProps} class={cx('text-center flex items-center justify-center w-[70%]', $$restProps.class)}>
			<svelte:component this={map[field.type]} {field} data={$getChartData.data?.data} />
		</div>
	{/key}
{/if}
