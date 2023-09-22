<script lang="ts">
	import { t } from '$lib/i18n'
	import { canCreateRecord, canDeleteRecord } from '$lib/store/table'
	import { confirmDeleteRecord, confirmDuplicateRecord } from '$lib/store/modal'
	import type { Record } from '@undb/core'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'

	export let record: Record | undefined
</script>

{#if $canCreateRecord || $canDeleteRecord}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<button class="dark:text-white">
				<i class="ti ti-dots" />
			</button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56">
			{#if $canCreateRecord}
				<DropdownMenu.Item
					on:click={() => {
						$confirmDuplicateRecord = true
					}}
					class="flex items-center gap-2"
				>
					<i class="ti ti-copy" />
					<span>{$t('Duplicate Record')}</span>
				</DropdownMenu.Item>
			{/if}

			{#if $canDeleteRecord}
				<DropdownMenu.Separator />
				<DropdownMenu.Item on:click={() => ($confirmDeleteRecord = true)} class="flex items-center gap-2 text-red-400">
					<i class="ti ti-trash" />
					<span>{$t('Delete Record')}</span>
				</DropdownMenu.Item>
			{/if}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
