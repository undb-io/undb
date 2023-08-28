<script lang="ts">
	import cx from 'classnames'
	import { invalidate } from '$app/navigation'
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import ViewIcon from '$lib/view/ViewIcon.svelte'
	import type { IViewDisplayType } from '@undb/core'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'

	const table = getTable()
	const view = getView()

	$: type = $view.displayType
	const displayTypes = ['grid', 'kanban', 'gallery', 'calendar', 'tree', 'dashboard', 'gantt'] as const

	const switchDisplayType = trpc().table.view.switchDisplayType.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const onChange = async (displayType: IViewDisplayType) => {
		$switchDisplayType.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			displayType,
		})
	}
</script>

{#if $hasPermission('table:switch_view_display_type')}
	<div class="gap-2 hidden lg:flex">
		{#each displayTypes as displayType}
			{@const isActive = displayType === type}
			<Tooltip.Root openDelay={10} positioning={{ placement: 'bottom' }}>
				<Tooltip.Trigger>
					<button type="button" on:click={() => onChange(displayType)}>
						<div
							class={cx(
								'grid h-7 w-7 place-items-center rounded p-1 duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 peer-checked:bg-gray-100 dark:peer-checked:bg-gray-800 peer-checked:border-gray-600 peer-checked:text-gray-600 hover:text-gray-500 cursor-pointer',
								isActive && 'bg-gray-100',
							)}
						>
							<ViewIcon type={displayType} />
						</div>
					</button>
				</Tooltip.Trigger>
				<Tooltip.Content class="z-50">
					<p>
						{$t(displayType)}
					</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{/each}
	</div>

	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			<button class="lg:hidden">
				<ViewIcon {type} />
			</button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			{#each displayTypes as displayType}
				<DropdownMenu.Item class="display-type cursor-pointer" on:click={() => onChange(displayType)}>
					<div
						class="flex items-center gap-2 w-full px-2 p-1 duration-300 hover:bg-gray-100 text-gray-600 text-xs peer-checked:bg-gray-100 peer-checked:border-gray-600 peer-checked:text-gray-600 hover:text-gray-500"
					>
						<ViewIcon type={displayType} />
						{$t(displayType)}
					</div>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
