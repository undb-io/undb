<script lang="ts">
	import { getTable } from '$lib/store/table'

	const table = getTable()
</script>

{#if $table}
	<div class="h-full">
		<iframe src={`/api/openapi/docs/tables/${$table.id.value}`} title="openapi" class="h-full w-full" />
	</div>
{/if}
