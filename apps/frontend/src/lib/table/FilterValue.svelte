<script lang="ts">
	import Color from '$lib/cell/CellInput/Color.svelte'
	import Date from '$lib/cell/CellInput/Date.svelte'
	import Email from '$lib/cell/CellInput/Email.svelte'
	import Url from '$lib/cell/CellInput/Url.svelte'
	import FilterExtensionPicker from '$lib/cell/CellInput/FilterExtensionPicker.svelte'
	import FilterTypePicker from '$lib/cell/CellInput/FilterTypePicker.svelte'
	import Number from '$lib/cell/CellInput/Number.svelte'
	import Rating from '$lib/cell/CellInput/Rating.svelte'
	import Select from '$lib/cell/CellInput/Select.svelte'
	import String from '$lib/cell/CellInput/String.svelte'
	import UserPicker from '$lib/cell/CellInput/UserPicker.svelte'
	import OptionsPicker from '$lib/option/OptionsPicker.svelte'
	import {
		isBuiltInDateOperator,
		type Field,
		type IDateFilterOperator,
		isOperatorWithoutValue,
		type IOperator,
		isDateRangeDateOperator,
		type IDateRangeFilterOperator,
	} from '@undb/core'
	import type { ComponentType } from 'svelte'
	import { withPrevious } from 'svelte-previous'
	import DateRange from '$lib/cell/CellInput/DateRange.svelte'
	import UsersPicker from '$lib/cell/CellInput/UsersPicker.svelte'
	import { t } from '$lib/i18n'

	export let field: Field | undefined
	export let operator: string | undefined
	export let value: any
	export let readonly = false

	let component: ComponentType | undefined

	const [currentField, previousField] = withPrevious(field?.id.value)
	$: if (!!$currentField && !!$previousField && $currentField !== $previousField) {
		value = null
	}

	$: type = field?.type
	$: {
		if (type === 'string') {
			component = String
		} else if (type === 'id') {
			component = String
		} else if (type === 'email') {
			component = Email
		} else if (type === 'url') {
			component = Url
		} else if (type === 'date' || type === 'updated-at' || type === 'created-at') {
			if (isBuiltInDateOperator(operator as IDateFilterOperator)) {
				component = undefined
				value = null
			} else if ((operator as IDateFilterOperator) === '$between') {
				component = DateRange
			} else {
				component = Date
			}
		} else if (
			type === 'number' ||
			type === 'auto-increment' ||
			type === 'sum' ||
			type === 'currency' ||
			type === 'count' ||
			type === 'average' ||
			type === 'min' ||
			type === 'max'
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
		} else if (type === 'multi-select') {
			component = OptionsPicker
		} else if (type === 'bool') {
			component = undefined
		} else if (type === 'attachment') {
			if (operator === '$has_file_type') {
				component = FilterTypePicker
			} else if (operator === '$has_file_extension') {
				component = FilterExtensionPicker
			} else {
				component = undefined
			}
		} else if (type === 'color') {
			if (!isOperatorWithoutValue(operator as IOperator)) {
				component = Color
			} else {
				component = undefined
			}
		} else if (type === 'collaborator' || type === 'created-by' || type === 'updated-by') {
			if (operator === '$eq' || operator === '$neq') {
				component = UserPicker
			} else if (operator === '$in' || operator === '$nin') {
				component = UsersPicker
			}
		} else if (type === 'date-range') {
			if (operator === '$is_empty' || operator === '$is_not_empty') component = undefined
			else if (!!operator && isDateRangeDateOperator(operator as IDateRangeFilterOperator)) component = Date
			else component = DateRange
		} else {
			component = undefined
		}

		if (operator && isOperatorWithoutValue(operator)) {
			value = null
			component = undefined
		}
	}

	$: wrapperClass = 'h-9 w-full bg-white border-gray-200 !justify-start'
	$: {
		if (type === 'rating') {
			wrapperClass += ' box-border border px-2'
		} else if (type === 'color') {
			wrapperClass += ' border border-r-1'
		}
	}

	$: placeholder = $t('field type filter value', { field: field?.name.value })
</script>

{#if operator && !isOperatorWithoutValue(operator)}
	<svelte:component
		this={component}
		bind:value
		{field}
		{...$$restProps}
		class={wrapperClass}
		disabled={!field}
		{placeholder}
		readonly={readonly ? true : undefined}
	/>
{/if}
