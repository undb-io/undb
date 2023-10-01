<script lang="ts">
	import Button from '$components/ui/button/button.svelte'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { getView } from '$lib/store/table'
	import { cn } from '$lib/utils'
	import ViewIcon from './ViewIcon.svelte'
	import ViewMenuContent from './ViewMenuContent.svelte'

	const view = getView()

	let open = false
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger asChild let:builder>
		<Button class={cn('gap-2', open && 'bg-gray-100')} builders={[builder]} variant="outline">
			<ViewIcon type={$view.displayType} />
			<span>
				{$view.name.value}
			</span>
			<i class="ti ti-chevron-down"></i>
		</Button>
	</DropdownMenu.Trigger>

	<ViewMenuContent view={$view} bind:open />
</DropdownMenu.Root>
