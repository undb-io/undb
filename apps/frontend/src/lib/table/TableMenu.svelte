<script lang="ts">
	import { t } from '$lib/i18n'
	import { erdModal, rlsModal, webhookModal } from '$lib/store/modal'
	import { currentRLSS } from '$lib/store/table'
	import { hasPermission } from '$lib/store/authz'
	import * as DropdownMenu from '$components/ui/dropdown-menu'
	import { Button } from '$components/ui/button'
	import { Badge } from '$components/ui/badge'

	let open = false
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost">
			<i class="ti ti-dots dark:text-gray-50"></i>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Item
			on:m-click={() => {
				webhookModal.open()
				open = false
			}}
		>
			<i class="ti ti-webhook text-gray-600 dark:text-gray-50" />
			<span>{$t('Webhook')}</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item
			on:m-click={() => {
				erdModal.open()
				open = false
			}}
		>
			<i class="ti ti-hierarchy-3 text-gray-600 dark:text-gray-50" />
			<span>{$t('ERD')}</span>
		</DropdownMenu.Item>
		{#if $hasPermission('rls:list')}
			<DropdownMenu.Item
				on:m-click={() => {
					rlsModal.open()
				}}
			>
				<i class="ti ti-key text-gray-600 dark:text-gray-50" />
				<span>{$t('rls', { ns: 'authz' })}</span>
				{#if $currentRLSS.length > 0}
					<Badge color="blue">{$currentRLSS.length}</Badge>
				{/if}
			</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
