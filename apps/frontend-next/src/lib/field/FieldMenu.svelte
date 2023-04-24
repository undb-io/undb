<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import { currentFieldId, getField, getTable, getView } from '$lib/store/table'
	import { updateFieldOpen } from '$lib/store/modal'
	import { trpc } from '$lib/trpc/client'
	import type { ISortDirection } from '@undb/core'
	import { DropdownDivider, DropdownItem } from 'flowbite-svelte'
	import { noop } from 'lodash'

	export let togglePin: (fieldId: string) => void = noop

	const table = getTable()
	const view = getView()
	const field = getField()
	const pinned = !!$view.pinnedFields?.getPinnedPosition($field!.id.value)

	async function sort(direction: ISortDirection) {
		if (!$field) return
		await trpc($page).table.view.sort.setFieldSort.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			fieldId: $field.id.value,
			direction,
		})

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

<DropdownItem class="inline-flex items-center gap-2 text-xs text-gray-500 font-medium" on:click={() => sort('asc')}>
	<i class="ti ti-sort-ascending2 text-sm" />
	<span>Asc</span>
</DropdownItem>
<DropdownItem class="inline-flex items-center gap-2 text-xs text-gray-500 font-medium" on:click={() => sort('desc')}>
	<i class="ti ti-sort-descending2 text-sm" />
	<span>Desc</span>
</DropdownItem>
