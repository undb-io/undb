<script lang="ts">
	import { cn } from '$lib/utils'
	import { getTable, getView } from '$lib/store/table'
	import { page } from '$app/stores'
	import ViewIcon from '$lib/view/ViewIcon.svelte'
	import { trpc } from '$lib/trpc/client'
	import { ViewVO, ViewName } from '@undb/core'
	import { tick } from 'svelte'
	import { invalidate } from '$app/navigation'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import ViewMenuContent from './ViewMenuContent.svelte'
	import { viewsSideBarOpen } from '$lib/store/modal'
	import { Button } from '$components/ui/button'

	const table = getTable()
	const currentView = getView()

	export let view: ViewVO

	$: active = $currentView.id.value === view.id.value

	$: name = view.name.value

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

	const updateName = trpc().table.view.updateName.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			view.name = new ViewName({ value: name })
			open = false
		},
	})
	const update = async () => {
		updating = false
		$updateName.mutate({
			tableId: $table.id.value,
			view: {
				id: view.id.value,
				name,
			},
		})
	}

	const handleInnerClick = (event: MouseEvent) => {
		event.stopPropagation()
		event.preventDefault()
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<li class="group" data-view-id={view.id.value} on:dblclick={() => (updating = !updating)}>
	<a
		href={active ? $page.url.pathname : `/t/${$table.id.value}/${view.id.value}`}
		type="button"
		role="tab"
		class={cn(
			'group rounded-sm inline-flex w-full justify-between items-center gap-2 text-sm font-medium text-center disabled:cursor-not-allowed px-4 py-2 transition',
			active
				? 'text-primary bg-primary/5 dark:text-gray-50 dark:bg-primary active'
				: 'hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-primary hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-gray-500 dark:text-gray-300',
		)}
		on:click={() => viewsSideBarOpen.set(false)}
	>
		<span class="inline-flex items-center gap-2 truncate">
			<ViewIcon
				type={view.displayType}
				class={cn(!active ? 'text-gray-400 dark:!text-gray-300 group-hover:text-gray-600' : '!font-semibold')}
			/>
			{#if updating}
				<form on:submit|preventDefault|stopPropagation={update}>
					<input
						bind:this={input}
						type="text"
						bind:value={view.name.value}
						on:blur={update}
						on:keydown={(e) => {}}
						class="outline-none border-none p-0 h-4 !focus:outline-none !focus-within:outline-none text-xs"
					/>
				</form>
			{:else}
				<span title={view.name.value} class="truncate">{view.name.value}</span>
			{/if}
		</span>

		<div class="opacity-0 group-hover:opacity-100 flex gap-2 items-center">
			<DropdownMenu.Root bind:open>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} variant="ghost" on:click={handleInnerClick} class="p-0 h-[unset]">
						<span id={view.id.value} class="w-4 inline-block">
							<i class="ti ti-square-rounded-chevron-down-filled" />
						</span>
					</Button>
				</DropdownMenu.Trigger>
				<ViewMenuContent bind:updating {view} bind:open />
			</DropdownMenu.Root>

			<div class="handle">
				<i class="ti ti-grip-vertical"></i>
			</div>
		</div>
	</a>
</li>
