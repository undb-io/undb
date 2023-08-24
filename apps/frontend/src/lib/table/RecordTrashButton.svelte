<script lang="ts">
	import { recordTrashModal } from '$lib/store/modal'
	import { Button } from '$components/ui/button'
	import { t } from '$lib/i18n'
</script>

<Button
	class="gap-1 dark:text-gray-50 dark:hover:border-gray-100 dark:bg-gray-800"
	variant="outline"
	size="sm"
	on:click={() => recordTrashModal.open()}
>
	<i class="ti ti-recycle" />
	<span class="hidden lg:block truncate">{$t('recycle bin', { ns: 'table' })}</span>
</Button>
