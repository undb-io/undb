<script lang="ts">
	import type { NumberFieldValue } from '@undb/core'

	export let value: NumberFieldValue | undefined
</script>

{#if value}
	<span>{value.unpack()}</span>
{/if}
