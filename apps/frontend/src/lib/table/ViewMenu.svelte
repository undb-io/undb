<script lang="ts">
	import { page } from '$app/stores'
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import ViewIcon from '$lib/view/ViewIcon.svelte'
	import { ViewName } from '@undb/core'
	import { Button, Chevron, Dropdown, DropdownDivider, DropdownItem } from 'flowbite-svelte'
	import { tick } from 'svelte'

	const table = getTable()
	const view = getView()
	let name = $view.name.value

	let updating = false
	let open = false
	let input: HTMLInputElement

	const handleUpdating = async () => {
		await tick()
		open = false
		input.focus()
		input.select()
	}
	$: if (updating) handleUpdating()

	const update = async () => {
		updating = false
		if (name !== $view.name.value) {
			await trpc($page).table.view.updateName.mutate({
				tableId: $table.id.value,
				view: {
					id: $view.id.value,
					name,
				},
			})
			$view.name = new ViewName({ value: name })
		}
	}

	const duplicateView = async () => {
		await trpc($page).table.view.duplicate.mutate({
			tableId: $table.id.value,
			id: $view.id.value,
		})
	}
</script>

<Button size="xs" color="alternative" class="h-full !rounded-md gap-2 whitespace-nowrap" on:click={() => (open = true)}>
	<ViewIcon type={$view.displayType} />
	{#if updating}
		<form on:submit|preventDefault|stopPropagation={update}>
			<input
				bind:this={input}
				type="text"
				bind:value={name}
				on:blur={update}
				on:keydown={(e) => {}}
				class="outline-none border-none p-0 h-4 !focus:outline-none !focus-within:outline-none text-xs w-14"
			/>
		</form>
	{:else}
		<Chevron>{$view.name.value}</Chevron>
	{/if}
</Button>
<Dropdown bind:open>
	<DropdownItem on:click={() => (updating = true)} class="text-sm font-normal inline-flex items-center gap-2">
		<i class="ti ti-pencil text-gray-400" />
		<span>update view name</span>
	</DropdownItem>
	<DropdownItem on:click={duplicateView} class="text-sm font-normal inline-flex items-center gap-2">
		<i class="ti ti-copy text-gray-400" />
		<span>duplicate view</span>
	</DropdownItem>
	{#if $table.views.count > 1}
		<DropdownDivider />
		<DropdownItem class="text-red-400 text-sm font-normal inline-flex items-center gap-2">
			<i class="ti ti-trash" />
			<span>delete view</span>
		</DropdownItem>
	{/if}
</Dropdown>
