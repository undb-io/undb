<script lang="ts">
	import { currentFieldId, currentOption, getTable, readonly } from '$lib/store/table'
	import { flip } from 'svelte/animate'
	import Option from '$lib/option/Option.svelte'
	import { dndzone } from 'svelte-dnd-action'
	import type { SelectField } from '@undb/core'
	import { trpc } from '$lib/trpc/client'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Badge } from '$lib/components/ui/badge'
	import { Button } from '$lib/components/ui/button'
	import { createOptionModal, updateOptionModal } from '$lib/store/modal'
	import { t } from '$lib/i18n'
	import KanbanLane from '$lib/kanban/KanbanLane.svelte'
	import { UNCATEGORIZED } from '$lib/kanban/kanban.constants'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { invalidate } from '$app/navigation'
	import { toast } from 'svelte-sonner'

	export let field: SelectField
	const flipDurationMs = 200

	const table = getTable()

	$: options = field?.options?.options ?? []

	$: items = [
		{
			id: UNCATEGORIZED,
			name: $t(UNCATEGORIZED),
			option: null,
		},
		...options.map((option) => ({
			id: option.key.value,
			name: option.name.value,
			option,
		})),
	]

	function handleDndConsiderColumns(e: any) {
		items = e.detail.items
	}

	const reorderOptions = trpc().table.field.select.reorderOptions.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

	const deleteOption = trpc().table.field.select.deleteOption.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	async function handleDndFinalizeColumns(e: any) {
		items = e.detail.items
		if (e.detail.info.id === UNCATEGORIZED) return

		const from = e.detail.info.id
		const toIndex = items.findIndex((i) => i.id === from) - 1
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

	let confirmDeleteOption = false
</script>

<div class="flex gap-5 h-full px-10 py-5 overflow-auto">
	<div
		class="flex gap-5 h-full"
		use:dndzone={{ items, flipDurationMs, type: 'columns', dropTargetStyle: {}, dragDisabled: $readonly }}
		on:consider={handleDndConsiderColumns}
		on:finalize={handleDndFinalizeColumns}
	>
		{#each items as item (item.id)}
			<div animate:flip={{ duration: flipDurationMs }}>
				<div class="w-[350px] flex flex-col h-full">
					<div class="flex-0">
						<div class="min-h-[40px]">
							{#if item.option}
								<div class="flex items-center justify-between pr-2">
									<Option option={item.option} />
									{#if !$readonly}
										<DropdownMenu.Root>
											<DropdownMenu.Trigger>
												<i class="ti ti-dots text-gray-400 dark:text-gray-200 cursor-pointer" />
											</DropdownMenu.Trigger>
											<DropdownMenu.Content>
												<DropdownMenu.Item
													class="gap-2 text-xs"
													on:click={() => {
														$currentFieldId = field?.id.value
														$currentOption = item.option
														updateOptionModal.open()
													}}
												>
													<i class="ti ti-pencil" />
													<span>
														{$t('Update Option')}
													</span>
												</DropdownMenu.Item>
												<DropdownMenu.Item
													class="text-red-400 text-xs gap-2"
													on:click={() => {
														if (item.option && field) {
															$currentOption = item.option
															confirmDeleteOption = true
														}
													}}
												>
													<i class="ti ti-trash" />
													<span>
														{$t('Delete Option')}
													</span>
												</DropdownMenu.Item>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									{/if}
								</div>
							{:else}
								<Badge variant="secondary">{item.name}</Badge>
							{/if}
						</div>
					</div>

					<KanbanLane
						data-container-id={item.id}
						kanbanId={item.id}
						{field}
						value={item.id}
						allowCreate
						initialValue={field && item.id !== UNCATEGORIZED ? { [field.id.value]: item.id } : undefined}
						filter={[
							{
								path: field.id.value,
								type: field.type,
								value: item.id === UNCATEGORIZED ? null : item.id,
								operator: '$eq',
							},
						]}
					/>
				</div>
			</div>
		{/each}
	</div>

	{#if !$readonly}
		<div class="w-[350px] shrink-0">
			<Button
				on:click={() => {
					currentFieldId.set(field?.id.value)
					createOptionModal.open()
				}}
				size="sm"
				variant="outline"
				class="w-full rounded-sm whitespace-nowrap inline-flex gap-2 dark:text-gray-200"
			>
				<i class="ti ti-plus" />
				{$t('Create New Option')}</Button
			>
		</div>
	{/if}
</div>

<AlertDialog.Root bind:open={confirmDeleteOption}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{$t('Confirm Delete Option')}</AlertDialog.Title>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel
				on:click={() => {
					confirmDeleteOption = false
				}}
			>
				{$t('Cancel', { ns: 'common' })}
			</AlertDialog.Cancel>
			<AlertDialog.Action
				variant="destructive"
				on:click={() => {
					if ($currentOption) {
						$deleteOption.mutate({
							tableId: $table.id.value,
							fieldId: field.id.value,
							id: $currentOption.key.value,
						})
					}
				}}
			>
				{$t('Confirm', { ns: 'common' })}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
