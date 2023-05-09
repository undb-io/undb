<script lang="ts">
	import { Heading } from 'flowbite-svelte'
	import type { NumberVirsualization } from '@undb/core'
	import { trpc } from '$lib/trpc/client'
	import { getTable } from '$lib/store/table'

	export let virsualization: NumberVirsualization

	const table = getTable()

	const aggregateNumber = trpc().table.aggregate.aggregateNumber.query({
		tableId: $table.id.value,
	})
</script>

<Heading class="text-center">
	{$aggregateNumber.data?.number}
</Heading>
