<script lang="ts">
	import cx from 'classnames'
	import { Heading } from 'flowbite-svelte'
	import type { NumberVirsualization } from '@undb/core'
	import { trpc } from '$lib/trpc/client'
	import { getTable, getView } from '$lib/store/table'

	export let virsualization: NumberVirsualization

	const table = getTable()
	const view = getView()
</script>

<div {...$$restProps} class={cx('text-center flex items-center justify-center', $$restProps.class)}>hello</div>
