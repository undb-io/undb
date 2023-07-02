<script lang="ts">
	import cx from 'classnames'
	import { invalidate } from '$app/navigation'
	import { currentFieldId, getField, getTable, getView } from '$lib/store/table'
	import { confirmDeleteField, duplicateFieldModal, updateFieldModal } from '$lib/store/modal'
	import { trpc } from '$lib/trpc/client'
	import { canDuplicate, type ISortDirection } from '@undb/core'
	import { DropdownDivider, DropdownItem, Modal, Toast } from 'flowbite-svelte'
	import { noop } from 'lodash-es'
	import { slide } from 'svelte/transition'
	import { t } from '$lib/i18n'
	import FieldMenuFieldComponent from './FieldMenu/FieldMenuFieldComponent.svelte'

	export let togglePin: (fieldId: string) => void = noop

	const table = getTable()
	const view = getView()
	const field = getField()
	$: pinned = !!$field && !!$view.pinnedFields?.getPinnedPosition($field.id.value)

	$: fieldDirection = $field ? $view.getFieldSort($field.id.value).into() : undefined

	const resetFieldSort = trpc().table.view.sort.resetFieldSort.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			currentFieldId.set(undefined)
		},
	})

	const setFieldSort = trpc().table.view.sort.setFieldSort.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			currentFieldId.set(undefined)
		},
	})

	const hideField = trpc().table.view.field.setVisibility.mutation({
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

<DropdownItem
	class="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-100 font-medium"
	on:click={() => updateFieldModal.open()}
>
	<i class="ti ti-edit text-sm" />
	<span>{$t('Update Field')}</span>
</DropdownItem>
{#if $field && canDuplicate($field.type)}
	<DropdownItem
		class="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-100 font-medium"
		on:click={() => duplicateFieldModal.open()}
	>
		<i class="ti ti-copy text-sm" />
		<span>{$t('Duplicate Field')}</span>
	</DropdownItem>
{/if}

<DropdownDivider />

<FieldMenuFieldComponent
	field={$field}
	class="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-100 font-medium"
/>

<DropdownItem
	class="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-100 font-medium"
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
</DropdownItem>
<DropdownItem
	class="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-100 font-medium"
	on:click={() => {
		if ($field) {
			$hideField.mutate({ tableId: $table.id.value, fieldId: $field.id.value, viewId: $view.id.value, hidden: true })
		}
	}}
>
	<i class="ti ti-eye-closed text-sm" />
	<span>{$t('Hide Field')}</span>
</DropdownItem>

<DropdownDivider />

<DropdownItem
	class={cx(
		'inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-100 font-medium',
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
</DropdownItem>
<DropdownItem
	class={cx(
		'inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-100 font-medium',
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
</DropdownItem>
<DropdownDivider />
<DropdownItem
	class={'inline-flex items-center gap-2 text-xs text-red-400'}
	on:click={() => ($confirmDeleteField = true)}
>
	<i class="ti ti-trash text-sm" />
	<span>
		{$t('Delete Field')}
	</span>
</DropdownItem>

{#if $resetFieldSort.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$resetFieldSort.error.message}
		</span>
	</Toast>
{/if}

{#if $setFieldSort.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$setFieldSort.error.message}
		</span>
	</Toast>
{/if}
