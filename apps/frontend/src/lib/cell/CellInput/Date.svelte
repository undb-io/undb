<script lang="ts">
	import type { DateField } from '@undb/core'
	import DateInput from './DateInput.svelte'
	import DateTimeInput from './DateTimeInput.svelte'

	export let value: string | undefined
	export let field: DateField
</script>

{#if !!field?.timeFormatString}
	<DateTimeInput bind:value {...$$restProps} />
{:else}
	<DateInput bind:value {...$$restProps} />
{/if}
