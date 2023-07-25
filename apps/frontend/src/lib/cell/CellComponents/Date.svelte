<script lang="ts">
	import type { DateField, DateFieldValue } from '@undb/core'
	import DateComponent from './DateComponent.svelte'

	export let value: DateFieldValue | undefined
	export let field: DateField
</script>

{#if value}
	<DateComponent value={value.unpack()} formatString={field.formatString} />
{/if}
