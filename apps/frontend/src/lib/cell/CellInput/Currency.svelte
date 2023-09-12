<script lang="ts">
	import { Input } from '$lib/components/ui/input'

	export let value: number | null = null

	const onChange = (e: Event) => {
		const target = e.target as HTMLInputElement
		value = target.value === '' ? null : Number(target.value)
	}
</script>

<Input type="number" bind:value step={1} {...$$restProps} on:change={onChange} />
