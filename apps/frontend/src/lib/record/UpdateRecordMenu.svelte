<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { t } from '$lib/i18n'
	import { canCreateRecord, canDeleteRecord, currentRecordId, getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { Record } from '@undb/core'
	import { Dropdown, DropdownDivider, DropdownItem, Modal, Spinner } from 'flowbite-svelte'
	import { Button } from '$lib/components/ui/button'

	let confirmDeleteOpen = false

	const table = getTable()
	export let record: Record | undefined

	const deleteRecord = trpc().record.delete.mutation({
		async onSuccess(data, variables, context) {
			$currentRecordId = undefined
			await goto($page.url.pathname)
		},
	})

	const duplicateRecord = trpc().record.duplicate.mutation({
		async onSuccess(data, variables, context) {
			$currentRecordId = undefined
		},
	})
</script>

{#if $canCreateRecord || $canDeleteRecord}
	<button>
		<i class="ti ti-dots" />
	</button>
	<Dropdown style="z-index: 50;" class="w-[200px]">
		{#if $canCreateRecord}
			<DropdownItem
				on:click={() => {
					if (record) {
						$duplicateRecord.mutate({ tableId: $table.id.value, id: record.id.value })
					}
				}}
				class="inline-flex items-center gap-2"
			>
				<i class="ti ti-copy" />
				<span class="text-xs">{$t('Duplicate Record')}</span>
			</DropdownItem>
		{/if}

		{#if $canDeleteRecord}
			<DropdownDivider />
			<DropdownItem on:click={() => (confirmDeleteOpen = true)} class="inline-flex items-center gap-2 text-red-400">
				<i class="ti ti-trash" />
				<span class="text-xs">{$t('Delete Record')}</span>
			</DropdownItem>
		{/if}
	</Dropdown>
{/if}

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
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-200">
			{$t('Confirm Delete Record')}
		</h3>
		<Button
			variant="destructive"
			class="mr-2 gap-2 whitespace-nowrap"
			disabled={$deleteRecord.isLoading}
			size="lg"
			on:click={() => {
				if (record) {
					$deleteRecord.mutate({ tableId: $table.id.value, id: record.id.value })
				}
			}}
		>
			{#if $deleteRecord.isLoading}
				<Spinner size="xs" />
			{:else}
				<i class="ti ti-circle-check text-sm" />
			{/if}
			{$t('Confirm Yes', { ns: 'common' })}</Button
		>
		<Button size="md" color="alternative" on:click={() => ($currentRecordId = undefined)}>
			{$t('Confirm No', { ns: 'common' })}
		</Button>
	</div>
</Modal>
