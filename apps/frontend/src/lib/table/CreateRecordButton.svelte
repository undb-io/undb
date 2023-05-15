<script lang="ts">
	import { t } from '$lib/i18n'
	import { createRecordOpen } from '$lib/store/modal'
	import { Button } from 'flowbite-svelte'
</script>

<Button
	on:click={() => createRecordOpen.set(true)}
	size="xs"
	class="h-full !rounded-md inline-flex items-center whitespace-nowrap bg-blue-500"
>
	<i class="ti ti-row-insert-bottom text-sm mr-2" />
	{$t('Create New Record')}</Button
>
