<script lang="ts">
	import type { PageData } from './$types'
	import Table from '$lib/table/table.svelte'

	export let data: PageData
</script>

<Table {...data} />
