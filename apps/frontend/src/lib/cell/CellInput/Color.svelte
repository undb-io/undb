<script lang="ts">
	import { DEFAULT_COLOR } from '@undb/core'

	export let value: string | undefined = DEFAULT_COLOR

	$: if (!value) {
		value = DEFAULT_COLOR
	}
</script>

<div class="inline-flex gap-2">
	<input bind:value class="rounded-sm" {...$$restProps} autocomplete="off" type="color" />
	<span>{value ?? ''}</span>
</div>
