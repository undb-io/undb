<script lang="ts">
	import { getTable, recordHash } from '$lib/store/table'
	import { flip } from 'svelte/animate'
	import type { TreeRecord } from './tree-view.type'
	import { dndzone, SHADOW_PLACEHOLDER_ITEM_ID, TRIGGERS } from 'svelte-dnd-action'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import type { TreeField } from '@undb/core'

	export let field: TreeField
	export let record: TreeRecord

	const table = getTable()
	const flipDurationMs = 150

	const handleConsider = (e: CustomEvent) => {
		const { items } = e.detail
		record.children = items
	}

	const updateRecord = trpc().record.update.mutation({
		async onSuccess() {
			await invalidate(`table:${$table.id.value}`)
			await $data.refetch()
		},
	})

	const data = trpc().record.tree.list.query(
		{
			tableId: $table.id.value,
			fieldId: field.id.value,
		},
		{
			enabled: false,
			queryHash: $recordHash,
		},
	)

	const handleFinalize = (e: CustomEvent) => {
		const { items, info } = e.detail
		record.children = items

		if (info.trigger === TRIGGERS.DROPPED_INTO_ZONE) {
			const parentFieldId = field.parentFieldId?.value
			const recordId = info.id
			const parentId = record.id || null
			if (parentFieldId) {
				$updateRecord.mutate({
					tableId: $table.id.value,
					id: recordId,
					values: {
						[parentFieldId]: parentId,
					},
				})
			}
		}
	}
</script>

<div
	use:dndzone={{
		items: record.children,
		dropTargetClasses: ['bg-yellow-50/50', 'outline-1', 'outline-dashed', 'min-h-[20px]'],
		dropTargetStyle: {},
	}}
	on:consider={handleConsider}
	on:finalize={handleFinalize}
>
	{#each record.children.filter((item) => item.id !== SHADOW_PLACEHOLDER_ITEM_ID) as r (r.id)}
		{@const title = r.record?.getDisplayFieldsValue($table)}
		<div class="relative ml-8 -mt-[1px]" data-record-id={r.id} animate:flip={{ duration: flipDurationMs }}>
			{#if title}
				<div class="py-2 px-3 bg-white border border-slate-200 border-collapse h-[40px]">
					{title}
				</div>
			{/if}

			{#if record.children.length}
				<svelte:self record={r} {field} />
			{/if}
		</div>
	{/each}
</div>
