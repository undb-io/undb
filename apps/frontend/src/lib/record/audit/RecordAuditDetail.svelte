<script lang="ts">
	import { getTable } from '$lib/store/table'
	import type { IFieldType } from '@undb/core'
	import { isEqual } from 'lodash-es'
	import type { IRecordUpdatedAuditDetail } from '@undb/integrations/dist'
	import type { ComponentType } from 'svelte'
	import StringAudit from './StringAudit.svelte'
	import FieldIcon from '$lib/field/FieldIcon.svelte'

	export let detail: IRecordUpdatedAuditDetail

	const table = getTable()

	$: schema = $table.schema.toIdMap()

	const map: Record<IFieldType, ComponentType> = {
		string: StringAudit,
		number: undefined,
		id: undefined,
		'created-at': undefined,
		'updated-at': undefined,
		'auto-increment': undefined,
		color: undefined,
		email: undefined,
		url: undefined,
		json: undefined,
		date: undefined,
		select: undefined,
		'multi-select': undefined,
		bool: undefined,
		'date-range': undefined,
		reference: undefined,
		tree: undefined,
		parent: undefined,
		rating: undefined,
		currency: undefined,
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

<div class="bg-slate-50 p-2 rounded-sm">
	{#each detail.schema as field}
		{@const previousValue = detail.previousRecord[field.name]}
		{@const value = detail.record[field.name]}

		{#if !isEqual(previousValue, value)}
			<div class="space-y-2">
				<div class="text-sm flex items-center text-gray-600 gap-2">
					<FieldIcon type={field.type} />
					<span>{field.name}</span>
				</div>
				<svelte:component this={map[field.type]} {previousValue} {value} />
			</div>
		{/if}
	{/each}
</div>
