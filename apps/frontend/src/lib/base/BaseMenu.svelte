<script lang="ts">
	import { Button } from '$components/ui/button'
	import * as DropdownMenu from '$components/ui/dropdown-menu'
	import { t } from '$lib/i18n'
	import ConfirmExportBaseAsTemplate from './ConfirmExportBaseAsTemplate.svelte'
	import { confirmDeleteBase, confirmExportBaseTemplate } from '$lib/store/modal'
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" size="icon" builders={[builder]}>
			<i class="ti ti-dots"></i>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Item class="text-xs gap-2" on:click={() => confirmExportBaseTemplate.open()}>
			<i class="ti ti-file-export"></i>
			<span>
				{$t('Export Base Template', { ns: 'base' })}
			</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item class="text-red-500 text-xs gap-2" on:click={() => ($confirmDeleteBase = true)}>
			<i class="ti ti-trash"></i>
			<span>
				{$t('Delete Base', { ns: 'base' })}
			</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<ConfirmExportBaseAsTemplate />
