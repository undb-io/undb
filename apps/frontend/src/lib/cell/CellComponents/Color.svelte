<script lang="ts">
	import type { ColorFieldValue } from '@undb/core'
	import ColorComponent from './ColorComponent.svelte'

	export let value: ColorFieldValue

	$: color = value?.unpack()
</script>

<ColorComponent value={color} />
