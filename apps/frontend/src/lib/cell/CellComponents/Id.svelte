<script lang="ts">
	import type { Record } from '@undb/core'

	export let record: Record

	$: value = record?.id.value
</script>

<span
	class="bg-gray-200 text-gray-600 border border-gray-300 dark:border-gray-950 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-600 dark:text-gray-200"
	>{value}</span
>
