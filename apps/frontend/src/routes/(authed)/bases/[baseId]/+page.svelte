<script lang="ts">
	import { Button } from '$components/ui/button'
	import { t } from '$lib/i18n'
	import TableCards from '$lib/table/TableCards.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<main class="pt-6">
	<div class="flex justify-between px-10">
		<div>
			<span class="text-xs text-gray-500">
				{$t('Base', { ns: 'base' })}
			</span>
		</div>

		<Button variant="outline" class="w-40">
			{$t('Create New Base', { ns: 'base' })}
		</Button>
	</div>

	<TableCards tables={data.baseTables} />
</main>
