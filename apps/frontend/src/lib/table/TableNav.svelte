<script lang="ts">
	import Separator from '$components/ui/separator/separator.svelte'
	import { getTable } from '$lib/store/table'
	import TableMenu from './TableMenu.svelte'
	import { hasPermission } from '$lib/store/authz'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import { updateTableModal } from '$lib/store/modal'
	import { t } from '$lib/i18n'
	import { sidebarCollapsed } from '$lib/store/ui'

	const table = getTable()
</script>

<div class="flex items-center px-3 py-2 gap-3 border-b relative">
	{#if $sidebarCollapsed}
		<div class="ml-2">
			<Tooltip.Root>
				<Tooltip.Trigger>
					<button on:click={() => ($sidebarCollapsed = false)}>
						<i class="ti ti-layout-sidebar-left-expand text-lg text-gray-500 dark:hover:text-gray-100" />
					</button>
				</Tooltip.Trigger>
				<Tooltip.Content
					class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
				>
					<kbd> Command + b </kbd>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	{/if}

	<p class="text-sm font-medium text-gray-800">
		{$table.name.value}
	</p>

	{#if $hasPermission('table:update')}
		<Separator orientation="vertical" class="h-3" />

		<Tooltip.Root openDelay={10} positioning={{ placement: 'bottom' }}>
			<Tooltip.Trigger>
				<button on:click={() => updateTableModal.open()}>
					<i class="ti ti-settings text-gray-600 dark:text-gray-200" />
				</button>
			</Tooltip.Trigger>
			<Tooltip.Content>
				{$t('Edit Table')}
			</Tooltip.Content>
		</Tooltip.Root>

		<TableMenu />
	{/if}
</div>
