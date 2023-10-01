<script lang="ts">
	import { currentRecordId, getGroupRecordsHash, getTable, listRecordFn, readonly } from '$lib/store/table'
	import { TRIGGERS, dndzone } from 'svelte-dnd-action'
	import KanbanCard from './KanbanCard.svelte'
	import { trpc } from '$lib/trpc/client'
	import { RecordFactory, type IFilters, type IKanbanField } from '@undb/core'
	import { flip } from 'svelte/animate'
	import { Button } from '$lib/components/ui/button'
	import { createRecordInitial, createRecordModal } from '$lib/store/modal'
	import { UNCATEGORIZED } from './kanban.constants'
	import { toast } from 'svelte-sonner'
	import { t } from '$lib/i18n'

	const flipDurationMs = 200

	const table = getTable()

	export let kanbanId: string
	export let filter: IFilters | undefined = undefined
	export let value: any
	export let field: IKanbanField
	export let allowCreate = false
	export let initialValue: globalThis.Record<string, any> | undefined = undefined

	$: hash = getGroupRecordsHash(kanbanId)

	const data = $listRecordFn(filter, { queryHash: $hash })

	$: records = RecordFactory.fromQueryRecords($data.data?.records ?? [], $table.schema.toIdMap())

	$: items = records.map((record) => ({ id: record.id.value, record }))

	const updateRecord = trpc().record.update.mutation({
		async onSuccess(data, variables, context) {
			toast.success($t('RECORD.UPDATED', { ns: 'success' }))
			await $data.refetch()
		},
		onError(error, variables, context) {
			toast.error(error.message)
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
				values: { [field.id.value]: value === UNCATEGORIZED ? null : value },
			})
		}
	}
</script>

{#if allowCreate && !$readonly}
	<Button
		variant="secondary"
		class="w-full rounded-md transition h-8 mb-4"
		size="sm"
		on:click={() => {
			if (initialValue) {
				$createRecordInitial = initialValue
			}
			createRecordModal.open($data.refetch)
		}}
	>
		<i class="ti ti-row-insert-top text-sm" />
	</Button>
{/if}

<div
	class="flex flex-col gap-2 flex-1 overflow-y-auto"
	use:dndzone={{ items, flipDurationMs, dropTargetStyle: {}, dragDisabled: $readonly }}
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
