<script lang="ts">
	import type { IVirsualizationTypeSchema, VirsualizationVO } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import NumberVirsualization from './NumberVirsualization.svelte'

	export let virsualization: VirsualizationVO | undefined
	const map: Record<IVirsualizationTypeSchema, ComponentType> = {
		number: NumberVirsualization,
	}
</script>

{#if virsualization}
	<svelte:component this={map[virsualization.type]} {virsualization} {...$$restProps} />
{/if}
