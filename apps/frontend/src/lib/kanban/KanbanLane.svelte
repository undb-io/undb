<script lang="ts">
	import { currentRecordId, getGroupRecordsHash, getTable, getView } from '$lib/store/table'
	import { TRIGGERS, dndzone } from 'svelte-dnd-action'
	import KanbanCard from './KanbanCard.svelte'
	import { trpc } from '$lib/trpc/client'
	import { RecordFactory, type IFilters, type Field, type IKanbanField } from '@undb/core'
	import { flip } from 'svelte/animate'
	import { Toast } from 'flowbite-svelte'
	import { slide } from 'svelte/transition'

	const flipDurationMs = 200

	const table = getTable()
	const view = getView()

	export let kanbanId: string
	export let filter: IFilters | undefined = undefined
	export let value: any
	export let field: IKanbanField

	$: hash = getGroupRecordsHash(kanbanId)

	$: data = trpc().record.list.query(
		{
			tableId: $table.id.value,
			viewId: $view.id.value,
			filter,
		},
		{ queryHash: $hash, refetchOnMount: false, refetchOnWindowFocus: false },
	)

	$: records = RecordFactory.fromQueryRecords($data.data?.records ?? [], $table.schema.toIdMap())

	$: items = records.map((record) => ({ id: record.id.value, record }))

	const updateRecord = trpc().record.update.mutation({
		async onSuccess(data, variables, context) {
			await $data.refetch()
		},
	})

	function handleDndConsiderCards(kanbanId: string, e: CustomEvent) {
		items = e.detail.items
	}
	function handleDndFinalizeCards(kanbanId: string, e: CustomEvent) {
		items = e.detail.items
		if (e.detail.info.trigger === TRIGGERS.DROPPED_INTO_ZONE && !(!value && field.required)) {
			$updateRecord.mutate({
				tableId: $table.id.value,
				id: e.detail.info.id,
				values: { [field.id.value]: value },
			})
		}
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

{#if $updateRecord.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$updateRecord.error.message}
		</span>
	</Toast>
{/if}
