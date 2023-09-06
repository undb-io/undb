<script>
	import { Button } from '$lib/components/ui/button'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { t } from '$lib/i18n'
	import { createTableModal, importDataModal } from '$lib/store/modal'
	import { hasPermission } from '$lib/store/authz'
</script>

<div class="h-full w-full flex flex-col gap-4 items-center justify-center content-center">
	{#if $hasPermission('table:create')}
		<p class="font-bold">{$t('Create New Table')}</p>

		<p class="inline-flex items-center">{@html $t('shortcut T', { shortcut: 'T' })}</p>

		<div>
			<Button class="w-[250px] rounded-r-none border-r-0" on:click={() => createTableModal.open()}>
				{$t('Create New Table')}
			</Button>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button class="rounded-l-none" builders={[builder]}>
						<i class="ti ti-chevron-down" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Item class="gap-2" on:click={() => importDataModal.open()}>
						<i class="ti ti-csv" />
						<span>
							{$t('import data content')}
						</span>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	{:else}
		<!-- else content here -->
	{/if}
</div>
