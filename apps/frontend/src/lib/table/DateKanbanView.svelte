<script lang="ts">
	import { getTable } from '$lib/store/table'
	import { flip } from 'svelte/animate'
	import { TRIGGERS } from 'svelte-dnd-action'
	import type { DateField } from '@undb/core'
	import { trpc } from '$lib/trpc/client'
	import { Badge, Button, Toast } from 'flowbite-svelte'
	import { slide } from 'svelte/transition'
	import { t } from '$lib/i18n'
	import { NODATE_STACK_ID } from '$lib/kanban/kanban.constants'
	import { KANBAN_DATE_STACKS, RElAVANT_DATES, getDateValue } from '$lib/kanban/kanban-date.utils'
	import { createRecordInitial, createRecordOpen } from '$lib/store/modal'
	import KanbanLane from '$lib/kanban/KanbanLane.svelte'

	export let field: DateField
	const flipDurationMs = 200

	const table = getTable()

	$: items = KANBAN_DATE_STACKS.map((stack) => ({
		id: stack,
		name: $t(stack, { ns: 'common' }),
	}))

	async function handleDndConsiderCards(cid: string, e: any) {}

	const updateRecord = trpc().record.update.mutation()
	async function handleDndFinalizeCards(cid: string, e: any) {
		if (field && e.detail.info.trigger === TRIGGERS.DROPPED_INTO_ZONE) {
			const value = getDateValue(e.target.dataset.containerId)
			if (field.required && e.target.dataset.containerId === NODATE_STACK_ID) return

			await $updateRecord.mutateAsync({
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

				<KanbanLane
					data-container-id={item.id}
					kanbanId={item.id}
					handleDndConsider={handleDndConsiderCards}
					handleDndFinalize={handleDndFinalizeCards}
					filter={[
						{
							path: field.id.value,
							type: field.type,
							value: item.id === NODATE_STACK_ID ? null : getDateValue(item.id)?.toISOString() ?? null,
							operator: '$eq',
						},
					]}
				/>
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
