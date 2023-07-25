<script lang="ts">
	import type { CreatedAtField, Record } from '@undb/core'
	import DateComponent from './DateComponent.svelte'

	export let record: Record
	export let field: CreatedAtField
</script>

<DateComponent value={record.createdAt.value} formatString={field.formatString} />
