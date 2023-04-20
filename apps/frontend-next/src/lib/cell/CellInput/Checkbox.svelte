<script lang="ts">
	import { Checkbox, NumberInput } from 'flowbite-svelte'
	export let value: boolean = false
</script>

<Checkbox bind:checked={value} {...$$restProps} size="18" />
