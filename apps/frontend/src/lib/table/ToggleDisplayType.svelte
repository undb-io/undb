<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import ViewIcon from '$lib/view/ViewIcon.svelte'
	import { Dropdown, Radio, Tooltip } from 'flowbite-svelte'

	const table = getTable()
	const view = getView()

	const type = $view.displayType
	const displayTypes = ['grid', 'kanban', 'gallery', 'calendar', 'tree', 'dashboard', 'gantt'] as const

	const switchDisplayType = trpc().table.view.switchDisplayType.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const onChange = async () => {
		$switchDisplayType.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			displayType: $view.displayType,
		})
	}
</script>

{#if $hasPermission('table:switch_view_display_type')}
	<div class="gap-2 hidden lg:flex">
		{#each displayTypes as displayType}
			<Radio
				class="display-type cursor-pointer"
				name="displayType"
				bind:group={$view.displayType}
				on:change={onChange}
				value={displayType}
				custom
			>
				<div
					class="grid h-7 w-7 place-items-center rounded p-1 duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 peer-checked:bg-gray-100 dark:peer-checked:bg-gray-800 peer-checked:border-gray-600 peer-checked:text-gray-600 hover:text-gray-500 cursor-pointer"
				>
					<ViewIcon type={displayType} />
				</div>
				<Tooltip class="z-50" placement="bottom">{$t(displayType)}</Tooltip>
			</Radio>
		{/each}
	</div>

	<button class="lg:hidden">
		<ViewIcon {type} />
		<Tooltip class="z-50" placement="bottom">{$t(type)}</Tooltip>
	</button>
	<Dropdown style="z-index: 50;">
		{#each displayTypes as displayType}
			<Radio
				class="display-type cursor-pointer"
				name="displayType"
				bind:group={$view.displayType}
				on:change={onChange}
				value={displayType}
				custom
			>
				<div
					class="flex items-center gap-2 h-10 w-full px-2 p-1 duration-300 hover:bg-gray-100 text-gray-600 text-xs peer-checked:bg-gray-100 peer-checked:border-gray-600 peer-checked:text-gray-600 hover:text-gray-500"
				>
					<ViewIcon type={displayType} />
					{$t(displayType)}
				</div>
			</Radio>
		{/each}
	</Dropdown>
{:else}
	<ViewIcon {type} />
	<Tooltip class="z-50" placement="bottom">{$t(type)}</Tooltip>
{/if}
