<script lang="ts">
	import { t } from '$lib/i18n'
	import { webhookListDrawer } from '$lib/store/drawer'
	import { erdModal, rlsModal } from '$lib/store/modal'
	import { Dropdown, DropdownItem } from 'flowbite-svelte'

	let open = false
</script>

<button>
	<i class="ti ti-dots"></i>
</button>
<Dropdown class="w-36" bind:open>
	<DropdownItem
		on:click={() => {
			webhookListDrawer.open()
			open = false
		}}
		class="text-xs font-normal inline-flex items-center gap-2"
	>
		<i class="ti ti-webhook text-gray-600 dark:text-gray-50" />
		<span>{$t('Webhook')}</span>
	</DropdownItem>
	<DropdownItem
		on:click={() => {
			erdModal.open()
			open = false
		}}
		class="text-xs font-normal inline-flex items-center gap-2"
	>
		<i class="ti ti-hierarchy-3 text-gray-600 dark:text-gray-50" />
		<span>{$t('ERD')}</span>
	</DropdownItem>
	<DropdownItem
		on:click={() => {
			rlsModal.open()
		}}
		class="text-xs font-normal inline-flex items-center gap-2"
	>
		<i class="ti ti-key text-gray-600 dark:text-gray-50" />
		<span>{$t('rls', { ns: 'authz' })}</span>
	</DropdownItem>
</Dropdown>
