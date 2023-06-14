<script lang="ts">
	import type { IVisualizationTypeSchema, VisualizationVO } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import NumberVisualizationSetting from './NumberVisualizationSetting.svelte'
	import ChartVisualizationSetting from './ChartVisualizationSetting.svelte'

	export let visualization: VisualizationVO | undefined
	const map: Record<IVisualizationTypeSchema, ComponentType> = {
		number: NumberVisualizationSetting,
		chart: ChartVisualizationSetting,
	}
</script>

{#if visualization}
	<svelte:component this={map[visualization.type]} {visualization} {...$$restProps} />
{/if}
