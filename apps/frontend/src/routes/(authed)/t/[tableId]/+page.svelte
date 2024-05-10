<script lang="ts">
	import CreateRecordSheet from '$lib/components/blocks/create-record/create-record-sheet.svelte';
	import GridView from '$lib/components/blocks/grid-view/grid-view.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<GridView t={data.table} />
<CreateRecordSheet data={data.createRecord} />
