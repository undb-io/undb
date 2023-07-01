<script lang="ts">
	import { t } from '$lib/i18n'
	import { createFieldModal } from '$lib/store/modal'
	import { Button, Tooltip } from 'flowbite-svelte'
</script>

<Button
	on:click={() => createFieldModal.open()}
	size="xs"
	color="alternative"
	class="h-full w-8 px-0 !rounded-md inline-flex items-center whitespace-nowrap transition "
>
	<i class="ti ti-column-insert-right text-sm" />
</Button>
<Tooltip class="z-50" placement="bottom">{$t('Insert Field Right')}</Tooltip>
