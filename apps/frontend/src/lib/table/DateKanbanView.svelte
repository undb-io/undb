<script lang="ts">
	import { currentRecordId, currentRecords, getTable, getView, recordHash } from '$lib/store/table'
	import { flip } from 'svelte/animate'
	import { TRIGGERS, dndzone } from 'svelte-dnd-action'
	import { groupBy } from 'lodash-es'
	import { DateField, DateFieldValue, Record, RecordFactory } from '@undb/core'
	import { trpc } from '$lib/trpc/client'
	import KanbanCard from '$lib/kanban/KanbanCard.svelte'
	import { Badge, Button, Toast } from 'flowbite-svelte'
	import { slide } from 'svelte/transition'
	import { t } from '$lib/i18n'
	import { isToday, isTomorrow, isYesterday, isAfter, endOfDay, addDays, isBefore, startOfDay } from 'date-fns'
	import { NODATE_STACK_ID } from '$lib/kanban/kanban.constants'
	import { KANBAN_DATE_STACKS, RElAVANT_DATES, getDateValue } from '$lib/kanban/kanban-date.utils'
	import { createRecordInitial, createRecordOpen } from '$lib/store/modal'

	export let field: DateField
	const flipDurationMs = 200

	const table = getTable()
	const view = getView()

	$: data = trpc().record.list.query({ tableId: $table.id.value, viewId: $view.id.value }, { queryHash: $recordHash })
	$: records = RecordFactory.fromQueryRecords($data.data?.records ?? [], $table.schema.toIdMap())
	$: $currentRecords = records

	$: groupedRecords = groupBy(records, (record: Record) => {
		const value = (record.values.value.get(field.id.value) as DateFieldValue | undefined)?.unpack()
		if (!value) return NODATE_STACK_ID
		if (isToday(value)) return 'TODAY'
		if (isTomorrow(value)) return 'TOMORROW'
		if (isYesterday(value)) return 'YESTERDAY'
		if (isAfter(value, endOfDay(addDays(new Date(), 1)))) return 'AFTER_TOMORROW'
		if (isBefore(value, startOfDay(addDays(new Date(), -1)))) return 'BEFORE_YESTERDAY'
		return NODATE_STACK_ID
	})

	$: items = KANBAN_DATE_STACKS.map((stack) => ({
		id: stack,
		name: $t(stack, { ns: 'common' }),
		records: groupedRecords[stack]?.map((record: Record) => ({ id: record.id.value, record })) ?? [],
	}))

	function handleDndConsiderCards(cid: string, e: any) {
		const colIdx = items.findIndex((c) => c.id === cid)
		if (items[colIdx]) {
			items[colIdx].records = e.detail.items
			items = [...items]
		}
	}

	const updateRecord = trpc().record.update.mutation({
		async onSuccess(data, variables, context) {
			await $data.refetch()
		},
	})
	async function handleDndFinalizeCards(cid: string, e: any) {
		const colIdx = items.findIndex((c) => c.id === cid)
		if (items[colIdx]) {
			items[colIdx].records = e.detail.items
			items = [...items]
		}

		if (field && e.detail.info.trigger === TRIGGERS.DROPPED_INTO_ZONE) {
			const value = getDateValue(e.target.dataset.containerId)
			if (field.required && e.target.dataset.containerId === NODATE_STACK_ID) return

			$updateRecord.mutate({
				tableId: $table.id.value,
				id: e.detail.info.id,
				values: { [field.id.value]: value },
			})
		}
	}
</script>

<div class="flex gap-5 h-full w-full px-10 py-5 overflow-scroll">
	{#each items as item (item.id)}
		<div animate:flip={{ duration: flipDurationMs }}>
			<div class="w-[350px] flex flex-col h-full">
				<div class="mb-3 flex-0">
					<div class="min-h-[40px]">
						<Badge color="dark">{item.name}</Badge>
					</div>

					{#if !RElAVANT_DATES.includes(item.id)}
						<Button
							color="alternative"
							class="w-full rounded-md transition h-8"
							size="xs"
							on:click={() => {
								if (field && item.id !== NODATE_STACK_ID) {
									$createRecordInitial = {
										[field.id.value]: getDateValue(item.id),
									}
								}
								$createRecordOpen = true
							}}
						>
							<i class="ti ti-row-insert-top text-sm" />
						</Button>
					{/if}
				</div>

				<div
					class="flex flex-col gap-2 flex-1 overflow-y-auto"
					data-container-id={item.id}
					use:dndzone={{ items: item.records, flipDurationMs, dropTargetStyle: {} }}
					on:consider={(e) => handleDndConsiderCards(item.id, e)}
					on:finalize={(e) => handleDndFinalizeCards(item.id, e)}
				>
					{#each item.records as record (record.id)}
						<div animate:flip={{ duration: flipDurationMs }}>
							<button
								data-record-id={record.id}
								class="!block w-full"
								on:click|preventDefault|stopPropagation={() => {
									$currentRecordId = record.id
								}}
							>
								<KanbanCard record={record.record} />
							</button>
						</div>
					{/each}
				</div>
			</div>
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
