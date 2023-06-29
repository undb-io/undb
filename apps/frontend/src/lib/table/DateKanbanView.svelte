<script lang="ts">
	import { flip } from 'svelte/animate'
	import type { DateField } from '@undb/core'
	import { Badge, Button } from 'flowbite-svelte'
	import { t } from '$lib/i18n'
	import { NODATE_STACK_ID } from '$lib/kanban/kanban.constants'
	import { KANBAN_DATE_STACKS, RElAVANT_DATES, getDateFilter, getDateValue } from '$lib/kanban/kanban-date.utils'
	import { createRecordInitial, createRecordModal } from '$lib/store/modal'
	import KanbanLane from '$lib/kanban/KanbanLane.svelte'
	import { readonly } from '$lib/store/table'

	export let field: DateField
	const flipDurationMs = 200

	$: items = KANBAN_DATE_STACKS.map((stack) => ({
		id: stack,
		name: $t(stack, { ns: 'common' }),
	}))
</script>

<div class="flex gap-5 h-full w-full px-10 py-5 overflow-scroll">
	{#each items as item (item.id)}
		<div animate:flip={{ duration: flipDurationMs }}>
			<div class="w-[350px] flex flex-col h-full">
				<div class="flex-0">
					<div class="min-h-[40px]">
						<Badge color="dark">{item.name}</Badge>
					</div>

					{#if !RElAVANT_DATES.includes(item.id) && !$readonly}
						<Button
							color="alternative"
							class="w-full rounded-md transition h-8 mb-4"
							size="xs"
							on:click={() => {
								if (field && item.id !== NODATE_STACK_ID) {
									$createRecordInitial = {
										[field.id.value]: getDateValue(item.id),
									}
								}
								createRecordModal.open()
							}}
						>
							<i class="ti ti-row-insert-top text-sm" />
						</Button>
					{/if}
				</div>

				<KanbanLane
					data-container-id={item.id}
					kanbanId={item.id}
					{field}
					value={getDateValue(item.id)}
					filter={getDateFilter(field, item.id)}
				/>
			</div>
		</div>
	{/each}
</div>
