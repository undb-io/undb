<script lang="ts">
	import { t } from '$lib/i18n'
	import { confirmBulkDeleteRecords, confirmBulkDuplicateRecords } from '$lib/store/modal'
	import { selectedCount } from '$lib/store/record'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$lib/components/ui/button'

	export let open: boolean
</script>

{#if open}
	<div
		class="fixed flex items-center p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow-md border bottom-5 right-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800 z-[999999999] w-96"
		role="alert"
	>
		<div class="flex items-center space-x-5 justify-between w-full">
			<p class="text-sm !text-gray-700 dark:!text-gray-100">{@html $t('Selected N Records', { n: $selectedCount })}</p>

			<div class="inline-flex items-center">
				<Button
					size="sm"
					class="inline-flex gap-2 rounded-r-none border-r-0"
					on:click={() => ($confirmBulkDuplicateRecords = true)}
				>
					{$t('Duplicate Selected Record')}
				</Button>

				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button size="sm" class="!pl-1 rounded-l-none" builders={[builder]}>
							<i class="ti ti-chevron-down"></i>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="z-[9999999999]">
						<DropdownMenu.Item class="text-red-400 gap-2" on:click={() => ($confirmBulkDeleteRecords = true)}>
							<i class="ti ti-trash text-lg" />
							{$t('Delete Selected Record')}
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</div>
{/if}
