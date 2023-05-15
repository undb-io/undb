<script lang="ts">
	import { t } from '$lib/i18n'
	import { createFieldOpen } from '$lib/store/modal'
	import { Button, Tooltip } from 'flowbite-svelte'
</script>

<Button
	on:click={() => createFieldOpen.set(true)}
	size="xs"
	outline
	class="h-full w-8 px-0 !rounded-md inline-flex items-center whitespace-nowrap transition"
>
	<i class="ti ti-column-insert-right text-sm" />
</Button>
<Tooltip placement="bottom">{$t('Insert Field Right')}</Tooltip>
