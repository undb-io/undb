<script lang="ts">
	import type { ColorFieldValue } from '@undb/core'

	export let value: ColorFieldValue

	$: color = value.unpack()
</script>

{#if color}
	<span class="inline-flex items-center gap-2">
		<span class="inline-block w-4 h-4 rounded-md" style={`background-color: ${color};`} />
		<span>{color}</span>
	</span>
{/if}
