<script lang="ts">
	import type { Record, UpdatedAtField } from '@undb/core'
	import DateComponent from './DateComponent.svelte'

	export let record: Record
	export let field: UpdatedAtField
</script>

<DateComponent value={record.updatedAt.value} formatString={field.formatString} />
