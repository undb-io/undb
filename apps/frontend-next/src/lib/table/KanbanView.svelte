<script lang="ts">
	import { getRecords, getTable } from '$lib/store/table'
	import { flip } from 'svelte/animate'
	import Option from '$lib/option/Option.svelte'
	import { dndzone } from 'svelte-dnd-action'
	import { groupBy } from 'lodash'
	import type { SelectField, SelectFieldValue } from '@undb/core'
	import { trpc } from '$lib/trpc/client'
	import { page } from '$app/stores'
	import KanbanCard from '$lib/kanban/KanbanCard.svelte'
	import { Button } from 'flowbite-svelte'
	import { createOptionOpen } from '$lib/store/modal'

	export let fieldId: string
	const flipDurationMs = 200

	const table = getTable()
	const records = getRecords()
	const field = $table.schema.getFieldById(fieldId).into() as SelectField

	const options = field.options.options

	const groupedRecords = groupBy($records, (record) => {
		const value = record.values.value.get(field.id.value) as SelectFieldValue | undefined

		if (!value?.id) return null
		return value.id
	})

	let items = options.map((option) => ({
		id: option.key.value,
		name: option.name.value,
		option,
		records: groupedRecords[option.key.value]?.map((record) => ({ id: record.id.value, record })) ?? [],
	}))

	function handleDndConsiderColumns(e: any) {
		items = e.detail.items
	}
	async function handleDndFinalizeColumns(e: any) {
		items = e.detail.items

		const from = e.detail.info.id
		const toIndex = items.findIndex((i) => i.id === from)
		const to = options[toIndex]?.key.value
		if (to && to !== from) {
			await trpc($page).table.field.select.reorderOptions.mutate({
				tableId: $table.id.value,
				fieldId: field.id.value,
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
	function handleDndFinalizeCards(cid: string, e: any) {
		const colIdx = items.findIndex((c) => c.id === cid)
		if (items[colIdx]) {
			items[colIdx].records = e.detail.items
			items = [...items]
		}
	}
</script>

<section
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
						<Option option={item.option} />
					</div>

					<Button color="alternative" class="w-full rounded-none h-8" size="xs">
						<i class="ti ti-row-insert-top text-sm" />
					</Button>
				</div>

				<div
					class="flex flex-col gap-2 flex-1 overflow-y-scroll"
					use:dndzone={{ items: item.records, flipDurationMs, dropTargetStyle: {} }}
					on:consider={(e) => handleDndConsiderCards(item.id, e)}
					on:finalize={(e) => handleDndFinalizeCards(item.id, e)}
				>
					{#each item.records as record (record.id)}
						<div animate:flip={{ duration: flipDurationMs }}>
							<KanbanCard record={record.record} />
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/each}

	<div class="w-[350px]">
		<Button on:click={() => createOptionOpen.set(true)} size="xs" color="light" outline class="w-full rounded-sm"
			>Create New Option</Button
		>
	</div>
</section>
