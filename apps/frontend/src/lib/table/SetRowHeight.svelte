<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { t } from '$lib/i18n'
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { viewRowHeights, type IViewRowHeight } from '@undb/core'
	import { Button } from '$components/ui/button'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { cn } from '$lib/utils'

	const table = getTable()
	const view = getView()

	$: rh = $view.rowHeight?.unpack()

	let open = false

	const setRowHeight = trpc().table.view.setRowHeight.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const onValueChange = (value: string | undefined) => {
		if (rh !== value) {
			$setRowHeight.mutate({ tableId: $table.id.value, viewId: $view.id.value, rowHeight: value as IViewRowHeight })
		}
	}
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger asChild let:builder>
		<Tooltip.Root openDelay={10} positioning={{ placement: 'bottom' }}>
			<Tooltip.Trigger asChild let:builder={b}>
				<Button variant="ghost" size="sm" builders={[builder, b]} class={cn(open && 'bg-gray-100')}>
					<i class="ti ti-line-height text-sm dark:text-gray-200" />
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content>
				{$t('Set Row Height')}
			</Tooltip.Content>
		</Tooltip.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.RadioGroup bind:value={rh} {onValueChange}>
			{#each viewRowHeights as rowHeight}
				<DropdownMenu.RadioItem value={rowHeight}>{$t(rowHeight)}</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
