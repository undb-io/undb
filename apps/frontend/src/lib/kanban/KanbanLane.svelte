<script lang="ts">
	import { currentRecordId, getGroupRecordsHash, getTable, getView } from '$lib/store/table'
	import { dndzone } from 'svelte-dnd-action'
	import KanbanCard from './KanbanCard.svelte'
	import { trpc } from '$lib/trpc/client'
	import { RecordFactory, type IFilters } from '@undb/core'
	import { flip } from 'svelte/animate'

	const flipDurationMs = 200

	const table = getTable()
	const view = getView()

	export let kanbanId: string
	export let filter: IFilters | undefined = undefined
	export let handleDndConsider: (id: string, e: any) => Promise<void>
	export let handleDndFinalize: (id: string, e: any) => Promise<void>

	$: hash = getGroupRecordsHash(kanbanId)

	$: data = trpc().record.list.query(
		{
			tableId: $table.id.value,
			viewId: $view.id.value,
			filter,
		},
		{ queryHash: $hash },
	)

	$: records = RecordFactory.fromQueryRecords($data.data?.records ?? [], $table.schema.toIdMap())

	$: items = records.map((record) => ({ id: record.id.value, record }))

	async function handleDndConsiderCards(kanbanId: string, e: CustomEvent) {
		items = e.detail.items
		await handleDndConsider(kanbanId, e)
	}
	async function handleDndFinalizeCards(kanbanId: string, e: CustomEvent) {
		items = e.detail.items
		await handleDndFinalize(kanbanId, e)
		await $data.refetch()
	}
</script>

<div
	class="flex flex-col gap-2 flex-1 overflow-y-auto"
	use:dndzone={{ items, flipDurationMs, dropTargetStyle: {} }}
	on:consider={(e) => handleDndConsiderCards(kanbanId, e)}
	on:finalize={(e) => handleDndFinalizeCards(kanbanId, e)}
	{...$$restProps}
>
	{#each items as item (item.id)}
		<div animate:flip={{ duration: flipDurationMs }}>
			<button
				data-record-id={item.id}
				class="!block w-full"
				on:click|preventDefault|stopPropagation={() => {
					$currentRecordId = item.id
				}}
			>
				<KanbanCard record={item.record} />
			</button>
		</div>
	{/each}
</div>
