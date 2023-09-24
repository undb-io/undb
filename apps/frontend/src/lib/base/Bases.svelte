<script lang="ts">
	import { t } from '$lib/i18n'
	import type { IQueryBase } from '@undb/core'

	export let bases: IQueryBase[] = []
</script>

<ul class="grid grid-cols-4">
	{#each bases as base}
		{base.name}
	{/each}

	<button
		class="cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 [&:focus:not(:focus-visible)]:outline-none focus-visible:ring-indigo-600 rounded-md border border-dashed border-slate-200 hover:border-slate-100 py-10 px-4 antialiased font-sans font-medium text-sm text-slate-600 leading-6 hover:text-slate-700 flex items-center justify-center gap-2"
	>
		<i class="ti ti-plus"></i>

		<span>
			{$t('Create New Base')}
		</span>
	</button>
</ul>
