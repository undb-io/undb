<script lang="ts">
	import { updateFieldOpen } from '$lib/store/modal'
	import { IconEdit } from '@tabler/icons-svelte'
	import { DropdownItem } from 'flowbite-svelte'
</script>

<DropdownItem
	class="inline-flex items-center gap-2 text-xs text-gray-500 font-medium"
	on:click={() => updateFieldOpen.set(true)}
>
	<IconEdit size={16} />
	<span>Update Field</span>
</DropdownItem>
