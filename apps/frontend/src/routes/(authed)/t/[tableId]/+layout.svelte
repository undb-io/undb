<script lang="ts">
	import { setTable } from '$lib/store/table.store';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	setTable(data.table);
</script>

<main class="flex flex-1 flex-col gap-4 px-4 py-2 lg:gap-6 lg:px-6 lg:py-4">
  <slot />
</main>
