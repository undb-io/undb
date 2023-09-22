<script lang="ts">
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { createFieldModal } from '$lib/store/modal'
	import * as Tooltip from '$lib/components/ui/tooltip'
	import { Button } from '$components/ui/button'
</script>

{#if $hasPermission('table:create_field')}
	<Tooltip.Root openDelay={10} positioning={{ placement: 'bottom' }}>
		<Tooltip.Trigger asChild let:builder>
			<Button builders={[builder]} on:click={() => createFieldModal.open()} size="sm" variant="ghost">
				<i class="ti ti-column-insert-right text-sm dark:text-gray-200" />
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content class="z-50">
			<p>
				{$t('Insert Field Right')}
			</p>
		</Tooltip.Content>
	</Tooltip.Root>
{/if}
