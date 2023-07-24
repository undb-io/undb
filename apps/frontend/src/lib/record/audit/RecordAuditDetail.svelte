<script lang="ts">
	import { getTable } from '$lib/store/table'
	import type { IFieldType } from '@undb/core'
	import { isEqual } from 'lodash-es'
	import type { IRecordUpdatedAuditDetail } from '@undb/integrations/dist'
	import type { ComponentType } from 'svelte'
	import StringAudit from './StringAudit.svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import NumberAudit from './NumberAudit.svelte'
	import JsonAudit from './JsonAudit.svelte'
	import DateAudit from './DateAudit.svelte'
	import RatingAudit from './RatingAudit.svelte'
	import ColorAudit from './ColorAudit.svelte'
	import MultiSelectAudit from './MultiSelectAudit.svelte'
	import SelectAudit from './SelectAudit.svelte'
	import BoolAudit from './BoolAudit.svelte'
	import DateRangeAudit from './DateRangeAudit.svelte'
	import ReferenceAudit from './ReferenceAudit.svelte'
	import TreeAudit from './TreeAudit.svelte'
	import ParentAudit from './ParentAudit.svelte'
	import CurrencyAudit from './CurrencyAudit.svelte'

	export let detail: IRecordUpdatedAuditDetail

	const table = getTable()

	$: schema = $table.schema.toIdMap()

	const map: Record<IFieldType, ComponentType | undefined> = {
		string: StringAudit,
		number: NumberAudit,
		id: undefined,
		'created-at': undefined,
		'updated-at': undefined,
		'auto-increment': undefined,
		color: ColorAudit,
		email: StringAudit,
		url: StringAudit,
		json: JsonAudit,
		date: DateAudit,
		select: SelectAudit,
		'multi-select': MultiSelectAudit,
		bool: BoolAudit,
		'date-range': DateRangeAudit,
		reference: ReferenceAudit,
		tree: TreeAudit,
		parent: ParentAudit,
		rating: RatingAudit,
		currency: CurrencyAudit,
		count: undefined,
		lookup: undefined,
		sum: undefined,
		average: undefined,
		attachment: undefined,
		collaborator: undefined,
		'created-by': undefined,
		'updated-by': undefined,
		min: undefined,
		max: undefined,
	}
</script>

<div class="bg-gray-100 border border-gray-200 shadow-sm p-2 rounded-md space-y-2">
	{#each detail.schema as field}
		{@const previousValue = detail.previousRecord[field.name]}
		{@const value = detail.record[field.name]}

		{#if !isEqual(previousValue, value)}
			<div class="space-y-1">
				<div class="text-sm flex items-center text-gray-600 gap-2">
					<FieldIcon type={field.type} />
					<span>{field.name}</span>
				</div>
				<svelte:component this={map[field.type]} {previousValue} {value} {field} />
			</div>
		{/if}
	{/each}
</div>
