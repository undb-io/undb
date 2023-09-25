<script lang="ts">
	import { t } from '$lib/i18n'
	import { createBaseModal } from '$lib/store/modal'
	import type { IQueryBase } from '@undb/core'

	export let bases: IQueryBase[] = []
</script>

<ul class="grid grid-cols-4 gap-3">
	{#each bases as base}
		<a
			href={`/bases/${base.id}`}
			class="cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 [&:focus:not(:focus-visible)]:outline-none focus-visible:ring-indigo-600 rounded-md block p-4 bg-white border border-solid border-slate-200 hover:border-slate-100 hover:shadow"
		>
			<h6 class="antialiased font-bold text-slate-900 leading-6 text-[1rem] flex items-center gap-1">
				<i class="ti ti-category"></i>
				<span>
					{base.name}
				</span>
			</h6>
		</a>
	{/each}

	<button
		class="cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 [&:focus:not(:focus-visible)]:outline-none focus-visible:ring-indigo-600 rounded-md border border-dashed border-slate-200 hover:border-slate-100 py-10 px-4 antialiased font-sans font-medium text-sm text-slate-600 leading-6 hover:text-slate-700 flex items-center justify-center gap-2"
		on:click={() => createBaseModal.open()}
	>
		<i class="ti ti-plus"></i>

		<span>
			{$t('Create New Base', { ns: 'base' })}
		</span>
	</button>
</ul>
