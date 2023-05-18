<script lang="ts">
	import { format, startOfDay } from 'date-fns'
	import { Input } from 'flowbite-svelte'

	export let value: string | undefined = undefined

	let dateValue = value ? format(new Date(value), 'yyyy-MM-dd') : ''
	$: value = dateValue ? startOfDay(new Date(dateValue)).toISOString() : ''
</script>

<Input type="date" bind:value={dateValue} {...$$restProps} />
