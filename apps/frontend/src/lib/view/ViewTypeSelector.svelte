<script lang="ts">
	import { Button, Dropdown, DropdownItem, Radio } from 'flowbite-svelte'
	import ViewIcon from './ViewIcon.svelte'
	import type { IViewDisplayType } from '@undb/core'
	import { t } from '$lib/i18n'

	let open = false

	const items = [
		{ value: 'grid', label: 'Grid' },
		{ value: 'kanban', label: 'Kanban' },
		{ value: 'calendar', label: 'Calendar' },
		{ value: 'tree', label: 'Tree' },
		{ value: 'dashboard', label: 'Dashboard' },
	] as const

	export let value: IViewDisplayType = 'grid'
</script>

<Button color="alternative" class="text-left flex items-center gap-2 whitespace-nowrap" on:click={() => (open = true)}>
	<ViewIcon type={value} />
	<span>
		{$t(value)}
	</span>
</Button>
<Dropdown bind:open>
	{#each items as item}
		<DropdownItem>
			<Radio custom value={item.value} bind:group={value} on:change={() => (open = false)}>
				<div role="button" class="flex items-center w-full h-full gap-2">
					<ViewIcon type={item.value} />
					{$t(item.value)}
				</div>
			</Radio>
		</DropdownItem>
	{/each}
</Dropdown>
