<script lang="ts">
	export let path: any[] = []
	import type { SuperForm } from 'sveltekit-superforms/client'
	import type { FieldTypeConvertStrategy, IFieldType } from '@undb/core'
	import type { ComponentType } from 'svelte'
	import Parent from './Parent.svelte'
	import Select from './Select.svelte'
	import Tree from './Tree.svelte'
	import Average from './Average.svelte'
	import Sum from './Sum.svelte'
	import Count from './Count.svelte'
	import Lookup from './Lookup.svelte'
	import Reference from './Reference.svelte'
	import Date from './Date.svelte'
	import DateRange from './DateRange.svelte'
	import Rating from './Rating.svelte'
	import CreatedAt from './CreatedAt.svelte'
	import UpdatedAt from './UpdatedAt.svelte'
	import Currency from './Currency.svelte'
	import Min from './Min.svelte'
	import Max from './Max.svelte'
	import QrCode from './QRCode.svelte'

	export let type: IFieldType
	export let isNew = false
	export let isUpdatingType = false
	export let fieldConvertStrategy: FieldTypeConvertStrategy | undefined = undefined
	export let form: SuperForm<any, any>

	const map: Partial<Record<IFieldType, ComponentType>> = {
		reference: Reference,
		rating: Rating,
		currency: Currency,
		date: Date,
		'date-range': DateRange,
		lookup: Lookup,
		count: Count,
		sum: Sum,
		average: Average,
		tree: Tree,
		select: Select,
		'multi-select': Select,
		parent: Parent,
		'created-at': CreatedAt,
		'updated-at': UpdatedAt,
		min: Min,
		max: Max,
		// qrcode: QrCode,
	}
</script>

<svelte:component
	this={map[type]}
	class={$$restProps.class}
	{form}
	{isNew}
	{path}
	{isUpdatingType}
	{fieldConvertStrategy}
/>
