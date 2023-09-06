<script lang="ts">
	import { cn } from '$lib/utils'
	import type { NumberVisualization } from '@undb/core'
	import { aggregateNumberFn } from '$lib/store/table'

	export let visualization: NumberVisualization

	const aggregateNumber = $aggregateNumberFn(visualization)
</script>

{#if $aggregateNumber.isLoading}
	<div class="w-full h-full animate-pulse bg-slate-100" />
{:else}
	<div class="flex items-center justify-center w-full">
		<h2
			{...$$restProps}
			title={String($aggregateNumber.data?.number)}
			class={cn(
				'scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-8xl flex items-center justify-center truncate text-left',
				$$restProps.class,
			)}
		>
			{$aggregateNumber.data?.number.toFixed(2)}
		</h2>
	</div>
{/if}
