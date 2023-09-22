<script lang="ts">
	import Button from '$components/ui/button/button.svelte'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { getView } from '$lib/store/table'
	import ViewIcon from './ViewIcon.svelte'
	import ViewMenuContent from './ViewMenuContent.svelte'

	const view = getView()

	let open = false
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button class="gap-2" builders={[builder]} variant="outline" on:click={() => (open = true)}>
			<ViewIcon type={$view.displayType} />
			<span>
				{$view.name.value}
			</span>
			<i class="ti ti-chevron-down"></i>
		</Button>
	</DropdownMenu.Trigger>

	<ViewMenuContent view={$view} bind:open />
</DropdownMenu.Root>
