<script lang="ts">
	import { getTable, getView } from '$lib/store/table'
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte'

	const table = getTable()
	const view = getView()
</script>

<Breadcrumb aria-label="undb navigator" class="hidden xl:block" olClass="md:space-x-0 flex items-center">
	<BreadcrumbItem href="/" home />
	<BreadcrumbItem class="whitespace-nowrap flex items-center">{$table.name.value}</BreadcrumbItem>
</Breadcrumb>
