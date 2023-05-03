<script lang="ts">
	import { format } from 'date-fns'
	import { Input } from 'flowbite-svelte'

	export let value: string | undefined = undefined

	$: value = value ? format(new Date(value), 'yyyy-MM-dd') : ''
</script>

<Input type="date" bind:value {...$$restProps} />
