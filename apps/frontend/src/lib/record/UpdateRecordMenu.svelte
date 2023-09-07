<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { t } from '$lib/i18n'
	import { canCreateRecord, canDeleteRecord, currentRecordId, getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { Record } from '@undb/core'
	import { Button } from '$lib/components/ui/button'
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'

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
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<button>
				<i class="ti ti-dots" />
			</button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56">
			{#if $canCreateRecord}
				<DropdownMenu.Item
					on:click={() => {
						if (record) {
							$duplicateRecord.mutate({ tableId: $table.id.value, id: record.id.value })
						}
					}}
					class="flex items-center gap-2"
				>
					<i class="ti ti-copy" />
					<span class="text-xs">{$t('Duplicate Record')}</span>
				</DropdownMenu.Item>
			{/if}

			{#if $canDeleteRecord}
				<DropdownMenu.Separator />
				<DropdownMenu.Item on:click={() => (confirmDeleteOpen = true)} class="flex items-center gap-2 text-red-400">
					<i class="ti ti-trash" />
					<span class="text-xs">{$t('Delete Record')}</span>
				</DropdownMenu.Item>
			{/if}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}

<AlertDialog.Root bind:open={confirmDeleteOpen}>
	<AlertDialog.Content class="z-[999999999]">
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
			<AlertDialog.Footer>
				<Button variant="secondary" on:click={() => ($currentRecordId = undefined)}>
					{$t('Confirm No', { ns: 'common' })}
				</Button>
				<Button
					variant="destructive"
					class="mr-2 gap-2 whitespace-nowrap"
					disabled={$deleteRecord.isLoading}
					on:click={() => {
						if (record) {
							$deleteRecord.mutate({ tableId: $table.id.value, id: record.id.value })
						}
					}}
				>
					{#if $deleteRecord.isLoading}
						<i class="ti ti-rotate animate-spin"></i>
					{:else}
						<i class="ti ti-circle-check text-sm" />
					{/if}
					{$t('Confirm Yes', { ns: 'common' })}</Button
				>
			</AlertDialog.Footer>
		</div>
	</AlertDialog.Content>
</AlertDialog.Root>
