<script lang="ts">
	export let path: any[] = []
	import Parent from './Parent.svelte'

	import Select from './Select.svelte'

	import Tree from './Tree.svelte'

	import Average from './Average.svelte'

	import Sum from './Sum.svelte'

	import Count from './Count.svelte'

	import Lookup from './Lookup.svelte'

	import type { SuperForm } from 'sveltekit-superforms/client'
	import type { IFieldType } from '@undb/core'
	import type { ComponentType } from 'svelte'

	import Reference from './Reference.svelte'
	import Date from './Date.svelte'
	import DateRange from './DateRange.svelte'
	import Rating from './Rating.svelte'

	export let type: IFieldType
	export let isNew = false

	export let form: SuperForm<any, any>

	const map: Partial<Record<IFieldType, ComponentType>> = {
		reference: Reference,
		rating: Rating,
		date: Date,
		'date-range': DateRange,
		lookup: Lookup,
		count: Count,
		sum: Sum,
		average: Average,
		tree: Tree,
		select: Select,
		parent: Parent,
	}
</script>

<svelte:component this={map[type]} {form} {isNew} {path} />
