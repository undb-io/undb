<script lang="ts">
	import { format } from 'date-fns'
	import { Input } from '$lib/components/ui/input'

	export let value: string | undefined = undefined
	export let readonly = false

	let dateValue = value ? format(new Date(value), "yyyy-MM-dd'T'HH:mm") : ''
	$: value = dateValue ? new Date(dateValue).toISOString() : ''
</script>

<Input type="datetime-local" bind:value={dateValue} {...$$restProps} readonly={readonly ? true : undefined} />
