<script lang="ts">
	import cx from 'classnames'
	import { Heading } from 'flowbite-svelte'
	import type { NumberVisualization } from '@undb/core'
	import { aggregateNumberFn } from '$lib/store/table'

	export let visualization: NumberVisualization

	const aggregateNumber = $aggregateNumberFn(visualization)
</script>

{#if $aggregateNumber.isLoading}
	<div class="w-full h-full animate-pulse bg-slate-100" />
{:else}
	<Heading {...$$restProps} class={cx('text-center flex items-center justify-center', $$restProps.class)}>
		{$aggregateNumber.data?.number}
	</Heading>
{/if}
