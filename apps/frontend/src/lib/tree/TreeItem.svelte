<script lang="ts">
	import { currentRecordId, getTable, readonly, recordHash } from '$lib/store/table'
	import { flip } from 'svelte/animate'
	import type { TreeRecord } from './tree-view.type'
	import { dndzone, SHADOW_PLACEHOLDER_ITEM_ID, TRIGGERS } from 'svelte-dnd-action'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import type { TreeField } from '@undb/core'

	export let field: TreeField
	export let record: TreeRecord
	export let level = 0

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
			queryHash: $recordHash + 'tree',
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
		dropTargetClasses: ['bg-yellow-50/50', 'outline-1', 'outline-dashed', 'min-h-[25px]'],
		dropTargetStyle: {},
		dragDisabled: $readonly,
	}}
	on:consider={handleConsider}
	on:finalize={handleFinalize}
>
	{#each record.children.filter((item) => item.id !== SHADOW_PLACEHOLDER_ITEM_ID) as r (r.id)}
		{@const title = r.record?.getDisplayFieldsValue($table)}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="relative ml-8 -mt-[1px]"
			data-record-id={r.id}
			animate:flip={{ duration: flipDurationMs }}
			on:click={() => {
				$currentRecordId = r.id
			}}
		>
			{#if title}
				<div
					class="p-3 bg-white border border-slate-200 border-collapse h-[40px] flex items-center justify-between group dark:bg-gray-700 dark:border-gray-500"
					class:border-l-0={!level}
				>
					<span class="text-gray-600 dark:text-gray-200">
						{title}
					</span>
					<!-- <div class="pr-5 opacity-0 group-hover:opacity-100 transition">
						<button
							on:click={() => {
								const parentFieldId = field.parentFieldId?.value
								if (!parentFieldId) return
								$createRecordInitial = {
									[parentFieldId]: record.id || null,
								}
								createRecordModal.open(async () => {
									await $data.refetch()
								})
							}}
						>
							<i class="block h-full ti ti-plus text-gray-600" />
						</button>
						<Tooltip>{$t('Create New Record')}</Tooltip>
					</div> -->
				</div>
			{/if}

			{#if record.children.length}
				<svelte:self record={r} {field} level={level + 1} />
			{/if}
		</div>
	{/each}
</div>
