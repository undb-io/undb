<script lang="ts">
	import * as Card from '$components/ui/card'
	import { t } from '$lib/i18n'
	import { selectTableMoveToBaseModal } from '$lib/store/modal'
</script>

<div class="flex h-full items-center justify-center">
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
