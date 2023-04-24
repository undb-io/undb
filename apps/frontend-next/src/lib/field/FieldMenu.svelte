<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { page } from '$app/stores'
	import { currentFieldId, getField, getTable, getView } from '$lib/store/table'
	import { updateFieldOpen } from '$lib/store/modal'
	import { trpc } from '$lib/trpc/client'
	import { IconEdit, IconPin, IconPinnedOff, IconSortAscending2, IconSortDescending2 } from '@tabler/icons-svelte'
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
	<IconEdit size={16} />
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
		<IconPinnedOff size={16} />
	{:else}
		<IconPin size={16} />
	{/if}
	<span>Pin</span>
</DropdownItem>

<DropdownDivider />

<DropdownItem class="inline-flex items-center gap-2 text-xs text-gray-500 font-medium" on:click={() => sort('asc')}>
	<IconSortAscending2 size={16} />
	<span>Asc</span>
</DropdownItem>
<DropdownItem class="inline-flex items-center gap-2 text-xs text-gray-500 font-medium" on:click={() => sort('desc')}>
	<IconSortDescending2 size={16} />
	<span>Desc</span>
</DropdownItem>
