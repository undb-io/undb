<script>
	import { P, Button, ButtonGroup, Dropdown, DropdownItem } from 'flowbite-svelte'
	import { t } from '$lib/i18n'
	import { createTableModal, importDataModal } from '$lib/store/modal'
</script>

<div class="h-full w-full flex flex-col gap-4 items-center justify-center content-center">
	<P weight="bold">{$t('Create New Table')}</P>

	<p class="inline-flex items-center">{@html $t('shortcut T', { shortcut: 'T' })}</p>

	<ButtonGroup>
		<Button class="w-[250px]" on:click={() => createTableModal.open()}>{$t('Create New Table')}</Button>
		<Button>
			<i class="ti ti-chevron-down" />
		</Button>
		<Dropdown placement="top" class="w-[200px]">
			<DropdownItem on:click={() => importDataModal.open()} class="flex items-center gap-2">
				<i class="ti ti-csv" />
				<span>
					{$t('import data content')}
				</span>
			</DropdownItem>
		</Dropdown>
	</ButtonGroup>
</div>
