<script lang="ts">
	import type { Record, TableSchemaIdMap } from '@undb/core'
	import { Card } from 'flowbite-svelte'

	export let schema: TableSchemaIdMap
	export let record: Record
</script>

<Card {...$$restProps}>
	{record.id.value}
</Card>
