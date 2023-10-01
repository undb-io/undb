<script lang="ts">
	import { cn } from '$lib/utils'
	import { invalidate } from '$app/navigation'
	import { currentFieldId, getField, getTable, getView, listRecordFn } from '$lib/store/table'
	import { confirmDeleteField, duplicateFieldModal, flsModal, updateFieldModal } from '$lib/store/modal'
	import { trpc } from '$lib/trpc/client'
	import { canDisplay, canDuplicate, isSortable, type ISortDirection } from '@undb/core'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { noop } from 'lodash-es'
	import { t } from '$lib/i18n'
	import FieldMenuFieldComponent from './FieldMenu/FieldMenuFieldComponent.svelte'
	import { toast } from 'svelte-sonner'

	export let togglePin: (fieldId: string) => void = noop

	const listRecords = $listRecordFn(undefined, { enabled: false })

	const table = getTable()
	const view = getView()
	const field = getField()
	$: pinned = !!$field && !!$view.pinnedFields?.getPinnedPosition($field.id.value)

	$: fieldDirection = $field ? $view.getFieldSort($field.id.value).into() : undefined

	const resetFieldSort = trpc().table.view.sort.resetFieldSort.mutation({
		async onSuccess(data, variables, context) {
			toast.success($t('TABLE.RESET_FIELD_SORT', { ns: 'success' }))
			await invalidate(`table:${$table.id.value}`)
			currentFieldId.set(undefined)
			await $listRecords.refetch()
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

	const setFieldSort = trpc().table.view.sort.setFieldSort.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			currentFieldId.set(undefined)
			await $listRecords.refetch()
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

	const hideField = trpc().table.view.field.setVisibility.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			currentFieldId.set(undefined)
		},
	})

	const setFieldDisplay = trpc().table.field.setDisplay.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			currentFieldId.set(undefined)
		},
	})

	async function sort(direction: ISortDirection) {
		if (!$field) return
		if (direction === fieldDirection) {
			$resetFieldSort.mutateAsync({
				tableId: $table.id.value,
				viewId: $view.id.value,
				fieldId: $field.id.value,
			})
		} else {
			$setFieldSort.mutateAsync({
				tableId: $table.id.value,
				viewId: $view.id.value,
				fieldId: $field.id.value,
				direction,
			})
		}
	}
</script>

<DropdownMenu.Item
	class="items-center gap-2 text-xs text-gray-800 dark:text-gray-100 font-medium hover:bg-gray-100"
	on:click={() => updateFieldModal.open()}
>
	<i class="ti ti-edit text-sm" />
	<span>{$t('Update Field')}</span>
</DropdownMenu.Item>
{#if $field && canDuplicate($field.type)}
	<DropdownMenu.Item
		class="items-center gap-2 text-xs text-gray-800 dark:text-gray-100 font-medium hover:bg-gray-100"
		on:click={() => duplicateFieldModal.open()}
	>
		<i class="ti ti-copy text-sm" />
		<span>{$t('Duplicate Field')}</span>
	</DropdownMenu.Item>
{/if}

<DropdownMenu.Separator />

<FieldMenuFieldComponent
	field={$field}
	class="items-center gap-2 text-xs text-gray-800 dark:text-gray-100 font-medium hover:bg-gray-100"
/>

<DropdownMenu.Item
	class="items-center gap-2 text-xs text-gray-800 dark:text-gray-100 font-medium hover:bg-gray-100"
	on:click={() => {
		if ($field) {
			togglePin($field.id.value)
		}
	}}
>
	{#if pinned}
		<i class="ti ti-pinned-off text-sm" />
		<span>{$t('Unset Pin Field')}</span>
	{:else}
		<i class="ti ti-pin text-sm" />
		<span>{$t('Pin Field')}</span>
	{/if}
</DropdownMenu.Item>
<DropdownMenu.Item
	class="items-center gap-2 text-xs text-gray-800 dark:text-gray-100 font-medium hover:bg-gray-100"
	on:click={() => {
		if ($field) {
			$hideField.mutate({ tableId: $table.id.value, fieldId: $field.id.value, viewId: $view.id.value, hidden: true })
		}
	}}
>
	<i class="ti ti-eye-closed text-sm" />
	<span>{$t('Hide Field')}</span>
</DropdownMenu.Item>

<DropdownMenu.Separator />

{#if $field && isSortable($field.type)}
	<DropdownMenu.Item
		class={cn(
			'items-center gap-2 text-xs text-gray-800 dark:text-gray-100 font-medium hover:bg-gray-100',
			fieldDirection === 'asc' && 'bg-gray-100',
		)}
		on:click={() => sort('asc')}
	>
		<i class="ti ti-sort-ascending-2 text-sm" />
		<span>
			{#if fieldDirection === 'asc'}
				{$t('Delete Sort Ascending')}
			{:else}
				{$t('Sort Ascending')}
			{/if}
		</span>
	</DropdownMenu.Item>
	<DropdownMenu.Item
		class={cn(
			'items-center gap-2 text-xs text-gray-800 dark:text-gray-100 font-medium hover:bg-gray-100',
			fieldDirection === 'desc' && 'bg-gray-100',
		)}
		on:click={() => sort('desc')}
	>
		<i class="ti ti-sort-descending-2 text-sm" />
		<span>
			{#if fieldDirection === 'desc'}
				{$t('Delete Sort Descending')}
			{:else}
				{$t('Sort Descending')}
			{/if}
		</span>
	</DropdownMenu.Item>
{/if}
<DropdownMenu.Item
	class={cn('items-center gap-2 text-xs text-gray-800 dark:text-gray-100 font-medium hover:bg-gray-100')}
	on:click={() => flsModal.open()}
>
	<i class="ti ti-shield-checkered-filled text-sm" />
	<span>
		{$t('fls', { ns: 'authz' })}
	</span>
</DropdownMenu.Item>
{#if $field && !$field.display && canDisplay($field.type)}
	<DropdownMenu.Item
		class={cn('items-center gap-2 text-xs text-gray-800 dark:text-gray-100 font-medium hover:bg-gray-100')}
		on:click={() => {
			if (!$field) return
			$setFieldDisplay.mutate({
				tableId: $table.id.value,
				fieldId: $field.id.value,
				display: true,
			})
		}}
	>
		<i class="ti ti-eye-check text-sm" />
		<span>
			{$t('set as display field')}
		</span>
	</DropdownMenu.Item>
{/if}
<DropdownMenu.Separator />
<DropdownMenu.Item
	class={'items-center gap-2 text-xs text-red-400 font-medium hover:bg-red-50'}
	on:click={() => ($confirmDeleteField = true)}
>
	<i class="ti ti-trash text-sm" />
	<span>
		{$t('Delete Field')}
	</span>
</DropdownMenu.Item>
