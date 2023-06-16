<script lang="ts">
	import type { IVisualizationTypeSchema, VisualizationVO } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import NumberVisualization from './NumberVisualization.svelte'
	import ChartVisualization from './ChartVisualization.svelte'

	export let visualization: VisualizationVO | undefined
	const map: Record<IVisualizationTypeSchema, ComponentType> = {
		number: NumberVisualization,
		chart: ChartVisualization
	}
</script>

{#if visualization}
	<svelte:component this={map[visualization.type]} {visualization} {...$$restProps} />
{/if}
