<script lang="ts">
	import { t } from '$lib/i18n'
	import {
		confirmDeleteTable,
		erdModal,
		exportTableTemplate,
		formListDrawer,
		mergeDataModal,
		moveToBaseModal,
		recordTrashModal,
		rlsModal,
		webhookModal,
	} from '$lib/store/modal'
	import { currentRLSS, getTable } from '$lib/store/table'
	import { hasPermission } from '$lib/store/authz'
	import * as DropdownMenu from '$components/ui/dropdown-menu'
	import { Badge } from '$components/ui/badge'
	import { goto } from '$app/navigation'

	const table = getTable()
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<button>
			<i
				class="ti ti-dots rounded-sm transition dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 text-gray-600"
			></i>
		</button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-52">
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
		<DropdownMenu.Item
			class="gap-2"
			on:click={() => {
				goto(`/t/${$table.id.value}/openapi`)
			}}
		>
			<i class="ti ti-code text-gray-600 dark:text-gray-50" />
			<span>{$t('API Preview')}</span>
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
		{#if $hasPermission('table:export_template')}
			<DropdownMenu.Item
				on:click={() => {
					exportTableTemplate.open()
				}}
				class="items-center gap-2"
			>
				<i class="ti ti-template text-gray-600 dark:text-gray-50" />
				<span>{$t('Export As Template')}</span>
			</DropdownMenu.Item>
		{/if}
		{#if $hasPermission('table:move_to_base')}
			<DropdownMenu.Item
				on:click={() => {
					moveToBaseModal.open()
				}}
				class="items-center gap-2"
			>
				<i class="ti ti-arrow-bar-to-right" />
				<span>{$t('move to base', { ns: 'base' })} </span>
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
				<span>{$t('recycle bin', { ns: 'table' })} </span>
			</DropdownMenu.Item>
		{/if}

		{#if $hasPermission('table:delete')}
			<DropdownMenu.Separator />
			<DropdownMenu.Item
				class="text-red-500 gap-2"
				on:click={() => {
					$confirmDeleteTable = true
				}}
			>
				<i class="ti ti-trash" />
				<span>{$t('Delete Table')}</span>
			</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
