<script lang="ts">
	import { format, startOfDay } from 'date-fns'
	import { Input } from '$lib/components/ui/input'
	import { isString } from 'lodash-es'

	export let readonly = false

	function dateIsValid(date: string) {
		return !Number.isNaN(new Date(date).getTime())
	}

	export let value: string | undefined = undefined

	let dateValue = isString(value) && dateIsValid(value) ? format(new Date(value), 'yyyy-MM-dd') : ''
	$: value = dateValue ? startOfDay(new Date(dateValue)).toISOString() : ''
</script>

<Input type="date" bind:value={dateValue} class={$$restProps.class} readonly={readonly ? true : undefined} />
