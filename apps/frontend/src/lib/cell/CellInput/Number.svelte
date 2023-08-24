<script lang="ts">
	import { Input } from '$lib/components/ui/input'

	export let value: number = 0
</script>

<Input {value} {...$$restProps} type="number" on:change={(e) => (value = Number(e.target.value))} />
