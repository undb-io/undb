<script lang="ts">
	import { format } from 'date-fns'
	import { Input } from 'flowbite-svelte'

	export let value: string | null

	$: date = value ? format(new Date(value), 'yyyy-MM-dd') : ''
</script>

<Input type="date" bind:value={date} {...$$restProps} />
