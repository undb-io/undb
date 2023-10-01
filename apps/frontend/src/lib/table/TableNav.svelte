<script lang="ts">
	import Separator from '$components/ui/separator/separator.svelte'
	import { currentBase, getTable } from '$lib/store/table'
	import TableMenu from './TableMenu.svelte'
	import { hasPermission } from '$lib/store/authz'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import { createTableModal, updateTableModal } from '$lib/store/modal'
	import { t } from '$lib/i18n'
	import { sidebarCollapsed } from '$lib/store/ui'
	import Button from '$components/ui/button/button.svelte'
	import Badge from '$components/ui/badge/badge.svelte'

	const table = getTable()
</script>

<div class="flex justify-between px-3 py-2 border-b">
	<div class="flex items-center gap-3 relative">
		{#if $sidebarCollapsed}
			<div class="ml-2">
				<Tooltip.Root>
					<Tooltip.Trigger>
						<button on:click={() => ($sidebarCollapsed = false)} class="w-4 h-4 flex items-center justify-center">
							<i class="ti ti-layout-sidebar-left-expand text-md text-gray-500 dark:hover:text-gray-100" />
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

		<div class="flex items-center gap-2">
			<Button
				size="icon"
				class="w-6 h-6"
				variant="outline"
				on:click={() => {
					window.history.back()
				}}
			>
				<i class="ti ti-arrow-back-up"></i>
			</Button>
			<span
				class="
	bg-primary/5 text-gray-700 dark:text-gray-50 dark:bg-gray-700 border-gray-200 group-hover:border-primary group-hover:text-primary dark:border-white dark:group-hover:border-gray-50 dark:group-hover:text-gray-50 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white
"
			>
				{$table.name.value.slice(0, 1)}
			</span>
			<p class="text-sm font-medium text-gray-800 dark:text-white">
				{$table.name.value}
			</p>

			{#if $currentBase}
				<Tooltip.Root openDelay={100}>
					<Tooltip.Trigger>
						<a href={`/bases/${$currentBase.id}`}>
							<Badge variant="outline" class="gap-1.5">
								<i class="ti ti-database"></i>
								<span>
									{$currentBase?.name}
								</span>
							</Badge>
						</a>
					</Tooltip.Trigger>
					<Tooltip.Content
						class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
					>
						{$t('base settings', { ns: 'base' })}
					</Tooltip.Content>
				</Tooltip.Root>
			{/if}
		</div>

		{#if $hasPermission('table:update')}
			<Separator orientation="vertical" class="h-3 bg-gray-300" />

			<Tooltip.Root openDelay={10} positioning={{ placement: 'bottom' }}>
				<Tooltip.Trigger>
					<button on:click={() => updateTableModal.open()}>
						<i
							class="ti ti-settings rounded-sm transition hover:bg-gray-100 dark:hover:bg-gray-700 p-1 text-gray-600 dark:text-gray-200 dark:bg-gray-700"
						/>
					</button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					{$t('Edit Table')}
				</Tooltip.Content>
			</Tooltip.Root>

			<TableMenu />
		{/if}
	</div>

	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button variant="ghost" size="xs" on:click={() => createTableModal.open()}>
				<i class="ti ti-plus"></i>
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content>
			{$t('Create New Table')}
		</Tooltip.Content>
	</Tooltip.Root>
</div>
