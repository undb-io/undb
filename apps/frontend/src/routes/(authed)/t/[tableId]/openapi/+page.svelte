<script lang="ts">
	import OpenApiToolbar from '$lib/openapi/OpenAPIToolbar.svelte'
	import { getTable } from '$lib/store/table'

	const table = getTable()
</script>

{#if $table}
	<div class="h-full">
		<OpenApiToolbar />
		<iframe src={`/api/openapi/docs/tables/${$table.id.value}`} title="openapi" class="h-full w-full" />
	</div>
{/if}
