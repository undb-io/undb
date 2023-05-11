<script lang="ts">
	import type { IVirsualizationTypeSchema, VirsualizationVO } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import NumberVirsualizationSetting from './NumberVirsualizationSetting.svelte'
	import ChartVirsualizationSetting from './ChartVirsualizationSetting.svelte'

	export let virsualization: VirsualizationVO | undefined
	const map: Record<IVirsualizationTypeSchema, ComponentType> = {
		number: NumberVirsualizationSetting,
		chart: ChartVirsualizationSetting,
	}
</script>

{#if virsualization}
	<svelte:component this={map[virsualization.type]} {virsualization} {...$$restProps} />
{/if}
