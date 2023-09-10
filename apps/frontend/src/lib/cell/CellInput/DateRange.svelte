<script lang="ts">
	import type { DateRangeField } from '@undb/core'
	import DateInput from './DateInput.svelte'
	import DateTimeInput from './DateTimeInput.svelte'

	export let field: DateRangeField
	export let value: [string | undefined, string | undefined] = [undefined, undefined]

	$: if (!value) {
		value = [undefined, undefined]
	}
</script>

<div class="flex gap-2 items-center">
	{#if !!field?.timeFormatString}
		<DateTimeInput bind:value={value[0]} class={$$restProps.class} />
	{:else}
		<DateInput bind:value={value[0]} class={$$restProps.class} />
	{/if}
	<span>-</span>
	{#if !!field?.timeFormatString}
		<DateTimeInput bind:value={value[1]} class={$$restProps.class} />
	{:else}
		<DateInput bind:value={value[1]} class={$$restProps.class} />
	{/if}
</div>
