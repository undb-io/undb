<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import * as DropdownMenu from '$components/ui/dropdown-menu'
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { confirmCreateFormFromView, confirmDuplicateView, confirmUpdateViewName } from '$lib/store/modal'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { IExportType, ViewVO, IViewDisplayType } from '@undb/core'
	import { tick } from 'svelte'
	import ViewIcon from './ViewIcon.svelte'
	import ConfirmDuplicateView from './ConfirmDuplicateView.svelte'
	import ConfirmUpdateViewName from './ConfirmUpdateViewName.svelte'
	import ConfirmCreateFormFromView from './ConfirmCreateFormFromView.svelte'
	import { toast } from 'svelte-sonner'

	const table = getTable()

	export let view: ViewVO
	export let open = false
	export let updating = false

	let input: HTMLInputElement

	const handleUpdating = async () => {
		await tick()
		open = false
		input.focus()
		input.select()
	}
	$: if (updating) handleUpdating()

	const deleteMutation = trpc().table.view.delete.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const deleteView = async () => {
		const index = $table.viewsOrder.order.findIndex((id) => id === view.id.value)
		await $deleteMutation.mutateAsync({
			tableId: $table.id.value,
			id: view.id.value,
		})
		const previous = $table.viewsOrder.order[index - 1] ?? $table.viewsOrder.order[0]
		goto(`/t/${$table.id.value}/${previous}`)
		open = false
		await tick()
	}

	const exportGrid = async (type: IExportType) => {
		const res = await fetch(`/api/tables/${$table.id.value}/${view.id.value}/${type}/export/grid`)
		open = false
		const blob = await res.blob()
		const a = document.createElement('a')
		a.href = window.URL.createObjectURL(blob)
		a.download = $table.name.value + ' - ' + view.name.value
		a.click()
		a.remove()
	}

	const switchDisplayTypeMutation = trpc().table.view.switchDisplayType.mutation({
		async onSuccess(data, variables, context) {
			toast.success(
				$t('TABLE.VIEW_DISPLAY_TYPE_SWITCHED', {
					ns: 'success',
					viewName: view.name.value,
					type: $t(variables.displayType),
				}),
			)
			await invalidate(`table:${$table.id.value}`)
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

	const switchDisplayType = async (displayType: IViewDisplayType) => {
		$switchDisplayTypeMutation.mutate({
			tableId: $table.id.value,
			viewId: view.id.value,
			displayType,
		})
	}
	const items = [
		{ value: 'grid', label: 'Grid' },
		{ value: 'kanban', label: 'Kanban' },
		{ value: 'gantt', label: 'Gantt' },
		{ value: 'calendar', label: 'Calendar' },
		{ value: 'tree', label: 'Tree' },
		{ value: 'gallery', label: 'Gallery' },
		{ value: 'dashboard', label: 'Dashboard' },
	] as const
</script>

<DropdownMenu.Content class="w-56">
	<DropdownMenu.Group>
		{#if $hasPermission('table:update_view_name')}
			<DropdownMenu.Item on:click={() => ($confirmUpdateViewName = true)} class="font-normal flex items-center gap-2">
				<i class="ti ti-pencil text-gray-500 dark:text-gray-50" />
				<span>{$t('Update View Name')}</span>
			</DropdownMenu.Item>
		{/if}
		{#if $hasPermission('table:switch_view_display_type')}
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>
					<span class="font-normal flex items-center gap-2">
						<i class="ti ti-switch-horizontal text-gray-500 dark:text-gray-50" />
						{$t('Select Display Type')}
					</span>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent class="w-52">
					{#each items.filter((i) => i.value !== view.displayType) as item}
						<DropdownMenu.Item
							on:click={() => {
								switchDisplayType(item.value)
							}}
							class="font-normal flex items-center gap-2"
						>
							<ViewIcon type={item.value} />
							<span>{$t(item.value)}</span>
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
		{/if}
		{#if $hasPermission('table:duplicate_view')}
			<DropdownMenu.Item on:click={() => ($confirmDuplicateView = true)} class="font-normal flex items-center gap-2">
				<i class="ti ti-copy text-gray-500 dark:text-gray-50" />
				<span>{$t('Duplicate View')}</span>
			</DropdownMenu.Item>
		{/if}
		{#if $hasPermission('table:export')}
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>
					<span class="font-normal flex items-center gap-2">
						<i class="ti ti-file-export text-gray-500 dark:text-gray-50" />
						{$t('Export')}
					</span>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent class="w-52">
					<DropdownMenu.Item on:click={() => exportGrid('csv')} class="font-normal flex items-center gap-2">
						<i class="ti ti-csv text-gray-500 dark:text-gray-50" />
						<span>{$t('Export CSV')}</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item on:click={() => exportGrid('excel')} class="font-normal flex items-center gap-2">
						<i class="ti ti-file-spreadsheet text-gray-500 dark:text-gray-50" />
						<span>{$t('Export Excel')}</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item on:click={() => exportGrid('json')} class="font-normal flex items-center gap-2">
						<i class="ti ti-json text-gray-500 dark:text-gray-50" />
						<span>{$t('Export Json')}</span>
					</DropdownMenu.Item>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
		{/if}
		{#if $hasPermission('table:create_form')}
			<DropdownMenu.Item
				on:click={() => {
					confirmCreateFormFromView.set(true)
				}}
				class="font-normal flex items-center gap-2"
			>
				<i class="ti ti-clipboard-text text-gray-500 dark:text-gray-50" />
				<span>{$t('create form from view')}</span>
			</DropdownMenu.Item>
		{/if}
		{#if $table.views.count > 1 && $hasPermission('table:delete_view')}
			<DropdownMenu.Separator />
			<DropdownMenu.Item class="text-red-500 font-normal flex items-center gap-2" on:click={deleteView}>
				<i class="ti ti-trash" />
				<span>{$t('Delete View')}</span>
			</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Group>
</DropdownMenu.Content>

<ConfirmDuplicateView {view} />
<ConfirmUpdateViewName {view} />
<ConfirmCreateFormFromView {view} />
