<script lang="ts">
	import { Button, Dropdown, DropdownItem, Radio } from 'flowbite-svelte'
	import ViewIcon from './ViewIcon.svelte'
	import type { IViewDisplayType } from '@undb/core'

	let open = false

	const items = [
		{ value: 'grid', label: 'Grid' },
		{ value: 'kanban', label: 'Kanban' },
	] as const

	export let value: IViewDisplayType = 'grid'
</script>

<Button color="alternative" class="text-left flex items-center gap-2" on:click={() => (open = true)}>
	<ViewIcon type={value} />
	{value}
</Button>
<Dropdown bind:open>
	{#each items as item}
		<DropdownItem>
			<Radio custom value={item.value} bind:group={value} on:change={() => (open = false)}>
				<div role="button" class="flex items-center w-full h-full gap-2">
					<ViewIcon type={item.value} />
					{item.value}
				</div>
			</Radio>
		</DropdownItem>
	{/each}
</Dropdown>
