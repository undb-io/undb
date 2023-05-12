<script lang="ts">
	import cx from 'classnames'
	import { Heading } from 'flowbite-svelte'
	import type { NumberVirsualization } from '@undb/core'
	import { trpc } from '$lib/trpc/client'
	import { getTable, getView } from '$lib/store/table'
	import EmptyChartVirsualization from './EmptyChartVirsualization.svelte'

	export let virsualization: NumberVirsualization

	const table = getTable()
	const view = getView()

	let fieldId = virsualization.fieldId?.value
</script>

{#if !fieldId}
	<EmptyChartVirsualization {...$$restProps} />
{:else}
	<div {...$$restProps} class={cx('text-center flex items-center justify-center', $$restProps.class)}>hello</div>
{/if}
