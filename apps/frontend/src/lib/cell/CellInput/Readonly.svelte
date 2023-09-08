<script lang="ts">
	import { Input } from '$lib/components/ui/input'
	export let value: any
</script>

<Input {value} class={$$restProps.class} readonly />
