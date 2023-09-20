<script lang="ts">
	import Separator from '$components/ui/separator/separator.svelte'
	import { getTable } from '$lib/store/table'
	import TableMenu from './TableMenu.svelte'
	import { hasPermission } from '$lib/store/authz'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import { updateTableModal } from '$lib/store/modal'
	import { t } from '$lib/i18n'

	const table = getTable()
</script>

<div class="flex items-center px-3 py-2 gap-3">
	<p class="text-sm font-medium text-gray-600">
		{$table.name.value}
	</p>

	{#if $hasPermission('table:update')}
		<Separator orientation="vertical" class="h-3" />

		<Tooltip.Root openDelay={10} positioning={{ placement: 'bottom' }}>
			<Tooltip.Trigger>
				<button on:click={() => updateTableModal.open()}>
					<i class="ti ti-settings text-gray-600 dark:text-gray-200" />
				</button>
			</Tooltip.Trigger>
			<Tooltip.Content>
				{$t('Edit Table')}
			</Tooltip.Content>
		</Tooltip.Root>

		<TableMenu />
	{/if}
</div>
