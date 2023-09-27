<script lang="ts">
	import type { PageData } from './$types'
	import Empty from '$lib/table/Empty.svelte'
	import { t } from '$lib/i18n'
	import { createTableModal } from '$lib/store/modal'
	import { sidebarCollapsed } from '$lib/store/ui'
	import { Button } from '$components/ui/button'
	import * as Tooltip from '$components/ui/tooltip'
	import Bases from '$lib/base/Bases.svelte'
	import { Input } from '$components/ui/input'

	export let data: PageData

	const onKeydown = (event: KeyboardEvent) => {
		const type = (event.target as any)?.type
		if (type === 'search' || type === 'text') return
		if (event.key === 't' && !(event.ctrlKey || event.altKey || event.metaKey)) {
			createTableModal.open()
		}
		if (event.key === 'b' && event.metaKey) {
			$sidebarCollapsed = !$sidebarCollapsed
		}
	}

	let q: string | undefined = undefined

	$: bases = data.bases.bases.filter((base) => (q ? base.name.toLowerCase().includes(q.toLowerCase()) : true))
</script>

{#if $sidebarCollapsed}
	<div class="fixed top-5 left-3">
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button variant="ghost" size="icon" builders={[builder]} on:click={() => ($sidebarCollapsed = false)}>
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

{#if !!data.tables.length}
	<main class="container pt-6">
		<Input bind:value={q} placeholder={$t('search', { ns: 'base' })}></Input>

		<h3 class="font-semibold my-4">Base</h3>

		<Bases {bases} />
	</main>
{:else}
	<Empty />
{/if}

<svelte:window on:keydown={onKeydown} />
