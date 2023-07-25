<script lang="ts">
	import type { StringFieldValue } from '@undb/core'

	export let value: StringFieldValue | undefined
</script>

{#if value}
	<span>{value?.unpack() ?? ''} </span>
{/if}
