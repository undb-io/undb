<script lang="ts">
	import { t } from '$lib/i18n'
	import { Button } from 'flowbite-svelte'
</script>

<Button size="xs" color="alternative" class="h-full !rounded-md gap-2 whitespace-nowrap">
	<i class="ti ti-columns-3 text-sm" />
	{$t('Manage Fields')}</Button
>
