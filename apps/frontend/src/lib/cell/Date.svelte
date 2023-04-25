<script lang="ts">
	import type { DateField, DateFieldValue } from '@undb/core'
	import DateComponent from './DateComponent.svelte'

	export let value: DateFieldValue
	export let field: DateField
</script>

<DateComponent value={value.unpack()} formatString={field.formatString} />
