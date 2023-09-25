<script lang="ts">
	import type { LayoutData } from './$types'
	import Empty from '$lib/table/Empty.svelte'
	import { t } from '$lib/i18n'
	import { createTableModal, importDataModal } from '$lib/store/modal'
	import { sidebarCollapsed } from '$lib/store/ui'
	import { hasPermission } from '$lib/store/authz'
	import { Button } from '$components/ui/button'
	import * as DropdownMenu from '$components/ui/dropdown-menu'
	import * as Tooltip from '$components/ui/tooltip'
	import TableCards from '$lib/table/TableCards.svelte'

	export let data: LayoutData

	const onKeydown = (event: KeyboardEvent) => {
		if (event.key === 't' && !(event.ctrlKey || event.altKey || event.metaKey)) {
			createTableModal.open()
		}
		if (event.key === 'b' && event.metaKey) {
			$sidebarCollapsed = !$sidebarCollapsed
		}
	}
</script>

<nav class="bg-white border-b h-16 px-5 py-4 border-gray-200 dark:bg-gray-900 dark:border-gray-600">
	{#if $sidebarCollapsed}
		<div class="fixed top-5 left-3">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button variant="ghost" builders={[builder]} on:click={() => ($sidebarCollapsed = false)}>
						<i class="ti ti-layout-sidebar-left-expand text-lg text-gray-500" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content
					sideOffset={1}
					class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
				>
					<kbd> Command + b </kbd>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	{/if}

	<div class="w-full flex justify-end" id="navbar-default">
		{#if $hasPermission('table:create')}
			<Button size="sm" variant="outline" on:click={() => createTableModal.open()} class="rounded-r-none border-r-0">
				<i class="ti ti-plus text-sm mr-3" />
				{$t('Create New Table')}
			</Button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button size="sm" variant="outline" class="rounded-l-none">
						<i class="ti ti-chevron-down" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Item on:click={() => importDataModal.open()} class="flex items-center gap-2">
						<i class="ti ti-csv" />
						<span>
							{$t('import data content')}
						</span>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
	</div>
</nav>

{#if !!data.tables.length}
	<main>
		<TableCards tables={data.tables} />
	</main>
{:else}
	<Empty />
{/if}

<svelte:window on:keydown={onKeydown} />
