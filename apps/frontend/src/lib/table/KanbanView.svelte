<script lang="ts">
	import { currentFieldId, currentRecordId, getRecords, getTable } from '$lib/store/table'
	import { flip } from 'svelte/animate'
	import Option from '$lib/option/Option.svelte'
	import { TRIGGERS, dndzone } from 'svelte-dnd-action'
	import { groupBy } from 'lodash-es'
	import type { SelectField, SelectFieldValue } from '@undb/core'
	import { trpc } from '$lib/trpc/client'
	import KanbanCard from '$lib/kanban/KanbanCard.svelte'
	import { Badge, Button, Toast } from 'flowbite-svelte'
	import { createOptionOpen, createRecordInitial, createRecordOpen } from '$lib/store/modal'
	import { invalidate } from '$app/navigation'
	import { slide } from 'svelte/transition'

	export let fieldId: string
	const flipDurationMs = 200

	const table = getTable()
	const records = getRecords()

	$: field = $table.schema.getFieldById(fieldId).into() as SelectField | undefined
	$: options = field?.options?.options ?? []

	const UNCATEGORIZED = 'uncategorized'
	$: groupedRecords = groupBy($records, (record) => {
		const value = (field ? record.values.value.get(field.id.value) : undefined) as SelectFieldValue | undefined

		if (!value?.id) return UNCATEGORIZED
		return value.id
	})

	$: items = [
		{
			id: UNCATEGORIZED,
			name: UNCATEGORIZED,
			option: null,
			records: groupedRecords[UNCATEGORIZED]?.map((record) => ({ id: record.id.value, record })) ?? [],
		},
		...options.map((option) => ({
			id: option.key.value,
			name: option.name.value,
			option,
			records: groupedRecords[option.key.value]?.map((record) => ({ id: record.id.value, record })) ?? [],
		})),
	]

	function handleDndConsiderColumns(e: any) {
		items = e.detail.items
	}

	const reorderOptions = trpc.table.field.select.reorderOptions.mutation()

	async function handleDndFinalizeColumns(e: any) {
		items = e.detail.items
		if (e.detail.info.id === UNCATEGORIZED) return

		const from = e.detail.info.id + 1
		const toIndex = items.findIndex((i) => i.id === from) + 1
		const to = options[toIndex]?.key.value
		if (to && to !== from && field) {
			$reorderOptions.mutate({
				tableId: $table.id.value,
				fieldId: field?.id.value,
				from,
				to,
			})
		}
	}

	function handleDndConsiderCards(cid: string, e: any) {
		const colIdx = items.findIndex((c) => c.id === cid)
		if (items[colIdx]) {
			items[colIdx].records = e.detail.items
			items = [...items]
		}
	}

	const updateRecord = trpc.record.update.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`records:${$table.id.value}`)
		},
	})
	async function handleDndFinalizeCards(cid: string, e: any) {
		const colIdx = items.findIndex((c) => c.id === cid)
		if (items[colIdx]) {
			items[colIdx].records = e.detail.items
			items = [...items]
		}

		if (field && e.detail.info.trigger === TRIGGERS.DROPPED_INTO_ZONE) {
			const optionId = e.target.dataset.containerId === UNCATEGORIZED ? null : e.target.dataset.containerId
			$updateRecord.mutate({
				tableId: $table.id.value,
				id: e.detail.info.id,
				values: { [field.id.value]: optionId },
			})
		}
	}
</script>

<div
	class="flex gap-5 h-full w-full px-10 py-5 overflow-scroll"
	use:dndzone={{ items, flipDurationMs, type: 'columns', dropTargetStyle: {} }}
	on:consider={handleDndConsiderColumns}
	on:finalize={handleDndFinalizeColumns}
>
	{#each items as item (item.id)}
		<div animate:flip={{ duration: flipDurationMs }}>
			<div class="w-[350px] flex flex-col h-full">
				<div class="mb-3 flex-0">
					<div class="min-h-[40px]">
						{#if item.option}
							<Option option={item.option} />
						{:else}
							<Badge color="dark">{item.name}</Badge>
						{/if}
					</div>

					<Button
						color="alternative"
						class="w-full rounded-md transition h-8"
						size="xs"
						on:click={() => {
							if (field && item.id !== UNCATEGORIZED) {
								$createRecordInitial = {
									[field.id.value]: item.id,
								}
							}
							$createRecordOpen = true
						}}
					>
						<i class="ti ti-row-insert-top text-sm" />
					</Button>
				</div>

				<div
					class="flex flex-col gap-2 flex-1 overflow-y-scroll"
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

	<div class="w-[350px] shrink-0">
		<Button
			on:click={() => {
				currentFieldId.set(field?.id.value)
				createOptionOpen.set(true)
			}}
			size="xs"
			color="light"
			outline
			class="w-full rounded-sm whitespace-nowrap">Create New Option</Button
		>
	</div>
</div>

{#if $reorderOptions.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$reorderOptions.error.message}
		</span>
	</Toast>
{/if}

{#if $updateRecord.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$updateRecord.error.message}
		</span>
	</Toast>
{/if}
