<script lang="ts">
	import cx from 'classnames'
	import { invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import { currentFieldId, getField, getTable, getView } from '$lib/store/table'
	import { updateFieldOpen } from '$lib/store/modal'
	import { trpc } from '$lib/trpc/client'
	import type { ISortDirection } from '@undb/core'
	import { DropdownDivider, DropdownItem } from 'flowbite-svelte'
	import { noop } from 'lodash-es'

	export let togglePin: (fieldId: string) => void = noop

	const table = getTable()
	const view = getView()
	const field = getField()
	$: pinned = !!$view.pinnedFields?.getPinnedPosition($field!.id.value)

	$: fieldDirection = $field ? $view.getFieldSort($field.id.value).into() : undefined

	async function sort(direction: ISortDirection) {
		if (!$field) return
		if (direction === fieldDirection) {
			await trpc($page).table.view.sort.resetFieldSort.mutate({
				tableId: $table.id.value,
				viewId: $view.id.value,
				fieldId: $field.id.value,
			})
		} else {
			await trpc($page).table.view.sort.setFieldSort.mutate({
				tableId: $table.id.value,
				viewId: $view.id.value,
				fieldId: $field.id.value,
				direction,
			})
		}
		await invalidate(`table:${$table.id.value}`)
		currentFieldId.set(undefined)
	}
</script>

<DropdownItem
	class="inline-flex items-center gap-2 text-xs text-gray-500 font-medium"
	on:click={() => updateFieldOpen.set(true)}
>
	<i class="ti ti-edit text-sm" />
	<span>Update Field</span>
</DropdownItem>

<DropdownDivider />

<DropdownItem
	class="inline-flex items-center gap-2 text-xs text-gray-500 font-medium"
	on:click={() => {
		if ($field) {
			togglePin($field.id.value)
		}
	}}
>
	{#if pinned}
		<i class="ti ti-pinned-off text-sm" />
	{:else}
		<i class="ti ti-pin text-sm" />
	{/if}
	<span>Pin</span>
</DropdownItem>

<DropdownDivider />

<DropdownItem
	class={cx(
		'inline-flex items-center gap-2 text-xs text-gray-500 font-medium',
		fieldDirection === 'asc' && 'bg-gray-100',
	)}
	on:click={() => sort('asc')}
>
	<i class="ti ti-sort-ascending-2 text-sm" />
	<span>
		{#if fieldDirection === 'asc'}
			Remove Asc
		{:else}
			Asc
		{/if}
	</span>
</DropdownItem>
<DropdownItem
	class={cx(
		'inline-flex items-center gap-2 text-xs text-gray-500 font-medium',
		fieldDirection === 'desc' && 'bg-gray-100',
	)}
	on:click={() => sort('desc')}
>
	<i class="ti ti-sort-descending-2 text-sm" />
	<span>
		{#if fieldDirection === 'desc'}
			Remove Desc
		{:else}
			Desc
		{/if}
	</span>
</DropdownItem>
