<script lang="ts">
	import { getTable } from '$lib/store/table'
	import { Breadcrumb, BreadcrumbItem, Button, P } from 'flowbite-svelte'

	const table = getTable()
</script>

<Breadcrumb aria-label="undb navigator" class="flex">
	<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
	<BreadcrumbItem class="whitespace-nowrap flex items-center">{$table.name.value}</BreadcrumbItem>
</Breadcrumb>
