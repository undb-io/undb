<script lang="ts">
	import cx from 'classnames'
	import { Button, ButtonGroup, Card, Dropdown, DropdownItem, Tooltip } from 'flowbite-svelte'
	import type { LayoutData } from './$types'
	import Empty from '$lib/table/Empty.svelte'
	import { t } from '$lib/i18n'
	import { createTableModal, importDataModal } from '$lib/store/modal'
	import { sidebarCollapsed } from '$lib/store/ui'

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

<nav class="bg-white border-b border-gray-200 dark:bg-gray-900">
	{#if $sidebarCollapsed}
		<div class="fixed top-3 left-3">
			<button on:click={() => ($sidebarCollapsed = false)}>
				<i class="ti ti-layout-sidebar-left-expand text-lg text-gray-500" />
			</button>
			<Tooltip placement="right" class="w-24">meta + b</Tooltip>
		</div>
	{/if}

	<div class="w-full px-5 py-4 flex justify-end" id="navbar-default">
		<ButtonGroup>
			<Button size="sm" on:click={() => createTableModal.open()}>
				<i class="ti ti-plus text-sm mr-3" />
				{$t('Create New Table')}
			</Button>
			<Button size="sm">
				<i class="ti ti-chevron-down" />
			</Button>
			<Dropdown placement="bottom" class="w-[200px]">
				<DropdownItem on:click={() => importDataModal.open()} class="flex items-center gap-2">
					<i class="ti ti-csv" />
					<span>
						{$t('import data content')}
					</span>
				</DropdownItem>
			</Dropdown>
		</ButtonGroup>
	</div>
</nav>

{#if !!data.tables.length}
	<main class="w-full p-10 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
		{#each data.tables as table}
			<Card href={`/t/${table.id}`} class="!max-w-none">
				<div class="flex items-center gap-3">
					<span
						class={cx(
							'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
							'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white',
						)}
					>
						{table.name.slice(0, 1)}
					</span>
					<h5 class="font-semibold">{table.name}</h5>
				</div>
			</Card>
		{/each}
		<Card
			class="!max-w-none cursor-pointer hover:bg-blue-500/90 hover:text-white transition"
			on:click={() => createTableModal.open()}
		>
			<div class="flex items-center gap-2">
				<i class="ti ti-plus" />
				<p class="text-sm">{$t('Create New Table')}</p>
			</div>
		</Card>
	</main>
{:else}
	<Empty />
{/if}

<svelte:window on:keydown={onKeydown} />
