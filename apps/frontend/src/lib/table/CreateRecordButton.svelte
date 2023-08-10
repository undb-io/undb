<script lang="ts">
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { createRecordModal } from '$lib/store/modal'
	import { Button } from 'flowbite-svelte'
</script>

{#if $hasPermission('record:create')}
	<Button
		on:click={() => createRecordModal.open()}
		size="xs"
		class="h-full !rounded-md inline-flex items-center whitespace-nowrap bg-blue-500"
	>
		<i class="ti ti-row-insert-bottom text-sm lg:mr-2" />
		<span class="hidden lg:block">
			{$t('Create New Record')}
		</span>
	</Button>
{/if}
