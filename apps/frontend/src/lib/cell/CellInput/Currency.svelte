<script lang="ts">
	import { Input } from '$lib/components/ui/input'

	export let value: number = 0
</script>

<Input type="number" bind:value step={1} {...$$restProps} />
