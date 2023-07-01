<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { t } from '$lib/i18n'
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { viewRowHeights } from '@undb/core'
	import { Button, Dropdown, DropdownItem, Radio } from 'flowbite-svelte'

	const table = getTable()
	const view = getView()

	let open = false

	$: rh = $view.rowHeight?.unpack()

	const setRowHeight = trpc().table.view.setRowHeight.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			open = false
		},
	})
</script>

<Button
	size="xs"
	color="light"
	outline
	class="h-full w-8 px-0 !rounded-md inline-flex items-center whitespace-nowrap transition"
	on:click={() => (open = !open)}
>
	<i class="ti ti-line-height text-sm" />
</Button>
<Dropdown bind:open class="z-[999999]">
	{#each viewRowHeights as rowHeight}
		<DropdownItem
			class="flex items-center justify-between"
			on:click={() => {
				if (rh !== rowHeight) {
					$setRowHeight.mutate({ tableId: $table.id.value, viewId: $view.id.value, rowHeight })
				}
			}}
		>
			<span>
				{$t(rowHeight)}
			</span>
			{#if rh === rowHeight}
				<i class="ti ti-check" />
			{/if}
		</DropdownItem>
	{/each}
</Dropdown>
