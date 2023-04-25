<script lang="ts">
	import { Input } from 'flowbite-svelte'
	export let value: any
</script>

<Input {value} {...$$restProps} readonly />
