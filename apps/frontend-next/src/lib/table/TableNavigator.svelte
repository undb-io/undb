<script lang="ts">
	import { getTable } from '$lib/context'
	import { Breadcrumb, BreadcrumbItem, Button, P } from 'flowbite-svelte'

	const table = getTable()
</script>

<Breadcrumb aria-label="undb navigator">
	<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
	<BreadcrumbItem>{$table.name.value}</BreadcrumbItem>
</Breadcrumb>
