<script lang="ts">
	import { format } from 'date-fns'
	import { Input } from 'flowbite-svelte'

	export let value: string | undefined = undefined

	let dateValue = value ? format(new Date(value), "yyyy-MM-dd'T'HH:mm") : ''
	$: value = dateValue ? new Date(dateValue).toISOString() : ''
</script>

<Input type="datetime-local" bind:value={dateValue} {...$$restProps} />
