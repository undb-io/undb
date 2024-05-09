<script lang="ts">
	import CreateTableButton from '$lib/components/blocks/create-table/create-table-button.svelte';
	import CreateTableDialog from '$lib/components/blocks/create-table/create-table-dialog.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<CreateTableButton />

<CreateTableDialog data={data.createTableForm} />
