<script lang="ts">
	import { page } from '$app/stores'
	import * as Card from '$components/ui/card'
	import Separator from '$components/ui/separator/separator.svelte'
	import { t } from '$lib/i18n'
	import { createTableModal, selectTableMoveToBaseModal } from '$lib/store/modal'
	import { createTableDefaultValue } from '$lib/store/table'
</script>

<div class="h-full">
	<div class="flex items-center justify-center h-full gap-6 pb-36">
		<Card.Root
			class="!max-w-none cursor-pointer hover:bg-primary-500/90  hover:shadow-sm transition border border-dashed border-slate-200 hover:border-slate-100 w-52"
			on:click={() => {
				createTableDefaultValue.set({
					baseId: $page.params.baseId,
				})
				createTableModal.open()
			}}
		>
			<Card.Header class="py-4">
				<div class="flex items-center justify-center gap-2 h-full font-normal text-sm text-gray-500">
					<i class="ti ti-plus" />
					<p>{$t('Create New Table')}</p>
				</div>
			</Card.Header>
		</Card.Root>

		<Separator orientation="vertical" class="h-10" />

		<Card.Root
			class="!max-w-none cursor-pointer hover:bg-primary-500/90  hover:shadow-sm transition border border-dashed border-slate-200 hover:border-slate-100 w-52"
			on:click={() => selectTableMoveToBaseModal.open()}
		>
			<Card.Header class="py-4">
				<div class="flex items-center justify-center gap-2 h-full font-normal text-sm text-gray-500">
					<i class="ti ti-arrow-bar-to-right" />
					<p>{$t('move to base', { ns: 'base' })}</p>
				</div>
			</Card.Header>
		</Card.Root>
	</div>
</div>
