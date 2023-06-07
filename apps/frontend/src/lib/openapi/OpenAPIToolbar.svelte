<script lang="ts">
	import cx from 'classnames'
	import { sidebarCollapsed } from '$lib/store/ui'
	import TableNavigator from '$lib/table/TableNavigator.svelte'
	import { Button, Chevron, Dropdown, DropdownItem } from 'flowbite-svelte'
</script>

<div class={cx('w-full py-3 border-b border-gray-200', $sidebarCollapsed ? 'px-2' : 'px-5')}>
	<div class="flex items-center gap-2 w-full">
		{#if $sidebarCollapsed}
			<div class="ml-2">
				<button on:click={() => ($sidebarCollapsed = false)}>
					<i class="ti ti-layout-sidebar-left-expand text-lg text-gray-500" />
				</button>
			</div>
		{/if}

		<div class="flex items-center justify-between w-full">
			<TableNavigator />
			<div>
				<Button size="xs"><Chevron>Download</Chevron></Button>
				<Dropdown>
					<DropdownItem>OpenAPI Spec</DropdownItem>
					<DropdownItem>Postman collection</DropdownItem>
				</Dropdown>
			</div>
		</div>
	</div>
</div>
