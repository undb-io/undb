<script lang="ts">
	import cx from 'classnames'
	import { getTable, getView } from '$lib/store/table'
	import { page } from '$app/stores'
	import ViewIcon from '$lib/view/ViewIcon.svelte'
	import { Dropdown, DropdownDivider, DropdownItem } from 'flowbite-svelte'
	import { trpc } from '$lib/trpc/client'
	import { View, ViewName } from '@undb/core'
	import { tick } from 'svelte'
	import { goto, invalidate } from '$app/navigation'
	import Portal from 'svelte-portal'

	const table = getTable()
	const currentView = getView()

	export let view: View

	$: active = $currentView.id.value === view.id.value

	let name = view.name.value

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
		if (name !== view.name.value) {
			await trpc($page).table.view.updateName.mutate({
				tableId: $table.id.value,
				view: {
					id: view.id.value,
					name,
				},
			})
			await invalidate(`table:${$table.id.value}`)
			view.name = new ViewName({ value: name })
			open = false
		}
	}

	const duplicateView = async () => {
		await trpc($page).table.view.duplicate.mutate({
			tableId: $table.id.value,
			id: view.id.value,
		})
		await invalidate(`table:${$table.id.value}`)
		open = false
		await tick()
		goto(`/t/${$table.id.value}/${$table.viewsOrder.last}`)
	}

	const deleteView = async () => {
		const index = $table.viewsOrder.order.findIndex((id) => id === view.id.value)
		await trpc($page).table.view.delete.mutate({
			tableId: $table.id.value,
			id: view.id.value,
		})
		await invalidate(`table:${$table.id.value}`)
		open = false
		await tick()
		const previous = $table.viewsOrder.order[index - 1] ?? $table.viewsOrder.order[0]
		goto(`/t/${$table.id.value}/${previous}`)
	}
</script>

<li class="group min-w-[125px]">
	<a
		href={active ? $page.url.pathname : `/t/${$table.id.value}/${view.id.value}`}
		type="button"
		role="tab"
		class={cx(
			'inline-flex w-full justify-between items-center gap-2 text-sm font-medium text-center disabled:cursor-not-allowed px-4 py-2 border-b-2',
			active
				? 'text-blue-600  border-blue-600 dark:text-blue-500 dark:border-blue-500 active'
				: 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-gray-500 dark:text-gray-400',
		)}
	>
		<span>
			<ViewIcon type={view.displayType} />
			{#if updating}
				<form on:submit|preventDefault|stopPropagation={update}>
					<input
						bind:this={input}
						type="text"
						bind:value={name}
						on:blur={update}
						on:keydown={(e) => {}}
						class="outline-none border-none p-0 h-4 !focus:outline-none !focus-within:outline-none text-xs"
					/>
				</form>
			{:else}
				<span>{view.name.value}</span>
			{/if}
		</span>
		{#if active}
			<span id={view.id.value} class="w-4 inline-block" on:click|preventDefault|stopPropagation={() => (open = true)}>
				<i class="ti ti-dots" />
			</span>
		{/if}
	</a>
	{#if active}
		<Portal target="body">
			<Dropdown triggeredBy={`#${view.id.value}`} {open} frameClass="z-[100]">
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
					<DropdownItem class="text-red-400 text-sm font-normal inline-flex items-center gap-2" on:click={deleteView}>
						<i class="ti ti-trash" />
						<span>delete view</span>
					</DropdownItem>
				{/if}
			</Dropdown>
		</Portal>
	{/if}
</li>
