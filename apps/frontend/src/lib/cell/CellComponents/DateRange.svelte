<script lang="ts">
	import type { DateRangeField, DateRangeFieldValue } from '@undb/core'
	import DateComponent from './DateComponent.svelte'

	export let value: DateRangeFieldValue | undefined
	export let field: DateRangeField

	const from = value?.from.into(null) ?? null
	const to = value?.to.into(null) ?? null
</script>

{#if value}
	<div class="inline-flex items-center gap-2">
		<DateComponent value={from} formatString={field.formatString} />
		{#if from || to}
			<span>-</span>
		{/if}
		<DateComponent value={to} formatString={field.formatString} />
	</div>
{/if}
