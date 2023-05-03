<script lang="ts">
	import { format } from 'date-fns'

	export let value: Date | null
	export let formatString: string
</script>

{#if !value}
	<span />
{:else}
	<span>{format(value, formatString)}</span>
{/if}
