<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte'

	const table = getTable()
	const view = getView()
</script>

<Breadcrumb aria-label="undb navigator" class="hidden xl:block" olClass="md:space-x-0 flex items-center">
	<BreadcrumbItem homeClass="dark:text-gray-200 dark:hover:text-gray-50" href="/" home />
	<BreadcrumbItem
		class="whitespace-nowrap flex items-center dark:!text-gray-200 max-w-xs truncate"
		spanClass="truncate w-full"
	>
		<span title={$table.name.value} class="truncate">
			{$table.name.value}
		</span>
	</BreadcrumbItem>
</Breadcrumb>
