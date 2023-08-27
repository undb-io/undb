<script lang="ts">
	import cx from 'classnames'
	import type { NumberVisualization } from '@undb/core'
	import { aggregateNumberFn } from '$lib/store/table'

	export let visualization: NumberVisualization

	const aggregateNumber = $aggregateNumberFn(visualization)
</script>

{#if $aggregateNumber.isLoading}
	<div class="w-full h-full animate-pulse bg-slate-100" />
{:else}
	<h1
		{...$$restProps}
		class={cx(
			'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-8xl text-center flex items-center justify-center',
			$$restProps.class,
		)}
	>
		{$aggregateNumber.data?.number}
	</h1>
{/if}
