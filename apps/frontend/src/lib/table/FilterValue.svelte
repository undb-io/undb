<script lang="ts">
	import Date from '$lib/cell/CellInput/Date.svelte'
	import Email from '$lib/cell/CellInput/Email.svelte'
	import Number from '$lib/cell/CellInput/Number.svelte'
	import Rating from '$lib/cell/CellInput/Rating.svelte'
	import Select from '$lib/cell/CellInput/Select.svelte'
	import String from '$lib/cell/CellInput/String.svelte'
	import OptionsPicker from '$lib/option/OptionsPicker.svelte'
	import type { Field } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import { withPrevious } from 'svelte-previous'

	export let field: Field | undefined
	export let operator: string | undefined
	export let value: any

	let component: ComponentType | undefined

	const [currentField, previousField] = withPrevious(field?.id.value)
	$: $currentField = field?.id.value
	$: if (!!$currentField && !!$previousField && $currentField !== $previousField) {
		value = undefined
	}

	$: type = field?.type
	$: {
		if (type === 'string') {
			component = String
		} else if (type === 'email') {
			component = Email
		} else if (type === 'date' || type === 'updated-at' || type === 'created-at') {
			component = Date
		} else if (
			type === 'number' ||
			type === 'auto-increment' ||
			type === 'sum' ||
			type === 'count' ||
			type === 'average'
		) {
			component = Number
		} else if (type === 'rating') {
			component = Rating
		} else if (type === 'select') {
			if (operator === '$eq' || operator === '$neq') {
				component = Select
			} else if (operator === '$in' || operator === '$nin') {
				component = OptionsPicker
			}
		} else if (type === 'bool') {
			component = undefined
		}
	}

	$: wrapperClass = 'h-8 w-full rounded-none border-l-0 !justify-start'
	$: {
		if (type === 'rating') {
			wrapperClass += ' box-border border px-2'
		}
	}
</script>

<svelte:component this={component} bind:value {field} {...$$restProps} class={wrapperClass} disabled={!field} />
