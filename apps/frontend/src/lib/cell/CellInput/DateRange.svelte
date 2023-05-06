<script lang="ts">
	import { Input } from 'flowbite-svelte'

	export let value: [string | undefined, string | undefined] = [undefined, undefined]

	$: if (!value) {
		value = [undefined, undefined]
	}
</script>

<div class="flex gap-2 items-center">
	<Input type="date" bind:value={value[0]} max={value[1]} />
	<span>-</span>
	<Input type="date" bind:value={value[1]} min={value[0]} />
</div>
