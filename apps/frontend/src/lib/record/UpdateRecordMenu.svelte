<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import { t } from '$lib/i18n'
	import { currentRecordId, getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { Record } from '@undb/core'
	import { Button, Dropdown, DropdownDivider, DropdownItem, Modal } from 'flowbite-svelte'

	let confirmDeleteOpen = false

	const table = getTable()
	const view = getView()
	export let record: Record | undefined

	const deleteRecord = trpc().record.delete.mutation({
		async onSuccess(data, variables, context) {
			$currentRecordId = undefined
			await goto($page.url.pathname)
		},
	})

	const records = trpc().record.list.query(
		{ tableId: $table.id.value, viewId: $view.id.value },
		{ queryHash: ['records', $table.id.value, $view.id.value].toString() },
	)

	const duplicateRecord = trpc().record.duplicate.mutation({
		async onSuccess(data, variables, context) {
			$currentRecordId = undefined
			await $records.refetch()
		},
	})
</script>

<button>
	<i class="ti ti-dots" />
</button>
<Dropdown>
	<DropdownItem
		on:click={() => {
			if (record) {
				$duplicateRecord.mutate({ tableId: $table.id.value, id: record.id.value })
			}
		}}
		class="inline-flex items-center gap-2"
	>
		<i class="ti ti-trash" />
		<span class="text-xs">{$t('Duplicate Record')}</span>
	</DropdownItem>
	<DropdownDivider />
	<DropdownItem on:click={() => (confirmDeleteOpen = true)} class="inline-flex items-center gap-2 text-red-400">
		<i class="ti ti-trash" />
		<span class="text-xs">{$t('Delete Record')}</span>
	</DropdownItem>
</Dropdown>

<Modal bind:open={confirmDeleteOpen} size="xs">
	<div class="text-center">
		<svg
			aria-hidden="true"
			class="mx-auto mb-4 w-14 h-14 text-gray-400 dark:text-gray-200"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			{$t('Confirm Delete Record')}
		</h3>
		<Button
			color="red"
			class="mr-2 gap-2"
			on:click={() => {
				if (record) {
					$deleteRecord.mutate({ tableId: $table.id.value, id: record.id.value })
				}
			}}
		>
			<i class="ti ti-circle-check text-lg" />
			{$t('Confirm Yes', { ns: 'common' })}</Button
		>
		<Button color="alternative">{$t('Confirm No', { ns: 'common' })}</Button>
	</div>
</Modal>
