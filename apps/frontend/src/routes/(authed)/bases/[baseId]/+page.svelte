<script lang="ts">
	import { Button } from '$components/ui/button'
	import { t } from '$lib/i18n'
	import { createBaseModal } from '$lib/store/modal'
	import TableCards from '$lib/table/TableCards.svelte'
	import EmptyBase from '$lib/base/EmptyBase.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<main class="pt-6 h-full flex flex-col">
	<div class="flex justify-between px-10 flex-shrink-0">
		<div class="inline-flex items-center gap-5">
			<Button size="icon" variant="outline" href="/">
				<i class="ti ti-arrow-back-up"></i>
			</Button>
			<div>
				<span class="text-xs text-gray-500">
					{$t('Base', { ns: 'base' })}
				</span>
				<h6 class="font-semibold leading-6">{data.base.base?.name}</h6>
			</div>
		</div>

		<Button variant="outline" class="w-40 gap-2" on:click={() => createBaseModal.open()}>
			<i class="ti ti-plus"></i>
			<span>
				{$t('Create New Base', { ns: 'base' })}
			</span>
		</Button>
	</div>

	<section class="px-10 py-6 flex-1">
		{#if data.baseTables.length}
			<TableCards tables={data.baseTables} />
		{:else}
			<EmptyBase />
		{/if}
	</section>
</main>
