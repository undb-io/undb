<script lang="ts">
	import GridView from '$lib/components/blocks/grid-view/grid-view.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<GridView t={data.table} />
