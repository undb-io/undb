<script lang="ts">
	import { t } from '$lib/i18n'
	import { erdModal, formListDrawer, mergeDataModal, recordTrashModal, rlsModal, webhookModal } from '$lib/store/modal'
	import { currentRLSS } from '$lib/store/table'
	import { hasPermission } from '$lib/store/authz'
	import * as DropdownMenu from '$components/ui/dropdown-menu'
	import { Button } from '$components/ui/button'
	import { Badge } from '$components/ui/badge'
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost" size="icon" class="w-9 h-9">
			<i class="ti ti-dots dark:text-gray-50"></i>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-48">
		{#if $hasPermission('table:list_form')}
			<DropdownMenu.Item
				on:click={() => {
					formListDrawer.open()
				}}
				class="items-center gap-2"
			>
				<i class="ti ti-clipboard-text"></i>
				{$t('forms')}
			</DropdownMenu.Item>
		{/if}

		<DropdownMenu.Item
			class="gap-2"
			on:click={() => {
				webhookModal.open()
			}}
		>
			<i class="ti ti-webhook text-gray-600 dark:text-gray-50" />
			<span>{$t('Webhook')}</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item
			class="gap-2"
			on:click={() => {
				erdModal.open()
			}}
		>
			<i class="ti ti-hierarchy-3 text-gray-600 dark:text-gray-50" />
			<span>{$t('ERD')}</span>
		</DropdownMenu.Item>
		{#if $hasPermission('rls:list')}
			<DropdownMenu.Item
				class="gap-2"
				on:click={() => {
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
		{#if $hasPermission('table:merge_data')}
			<DropdownMenu.Item
				on:click={() => {
					mergeDataModal.open()
				}}
				class="items-center gap-2"
			>
				<i class="ti ti-database-import text-gray-600 dark:text-gray-50" />
				<span>{$t('merge data')}</span>
			</DropdownMenu.Item>
		{/if}
		{#if $hasPermission('table:merge_data')}
			<DropdownMenu.Item
				on:click={() => {
					mergeDataModal.open()
				}}
				class="items-center gap-2"
			>
				<i class="ti ti-database-import text-gray-600 dark:text-gray-50" />
				<span>{$t('Export As Template')}</span>
			</DropdownMenu.Item>
		{/if}

		{#if $hasPermission('record:list_trash')}
			<DropdownMenu.Separator />
			<DropdownMenu.Item
				on:click={() => {
					recordTrashModal.open()
				}}
				class="items-center gap-2"
			>
				<i class="ti ti-recycle" />
				<span class="hidden lg:block truncate">{$t('recycle bin', { ns: 'table' })} </span></DropdownMenu.Item
			>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
