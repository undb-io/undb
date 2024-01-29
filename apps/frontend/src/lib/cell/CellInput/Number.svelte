<script lang="ts">
	import { Input } from '$lib/components/ui/input'

	export let value: number | null = null
	const onChange = (e: Event) => {
		const target = e.target as HTMLInputElement
		if (target) {
			value = target.value === '' ? null : Number(target.value)
		}
	}

	export let readonly = false
</script>

<Input
	{value}
	class={$$restProps.class}
	type="number"
	step={0.01}
	{...$$restProps}
	on:change={onChange}
	readonly={readonly ? true : undefined}
/>
