<script lang="ts">
	import { getView } from '$lib/context'
	import { updateFieldOpen } from '$lib/store/modal'
	import { currentField } from '$lib/store/table'
	import { IconEdit, IconPin, IconPinnedOff } from '@tabler/icons-svelte'
	import { DropdownDivider, DropdownItem } from 'flowbite-svelte'
	import { noop } from 'lodash'

	export let togglePin: (fieldId: string) => void = noop

	const view = getView()
	const pinned = !!$view.pinnedFields?.getPinnedPosition($currentField!.id.value)
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
		if ($currentField) {
			togglePin($currentField.id.value)
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
