<script lang="ts">
	import { recordTrashModal } from '$lib/store/modal'
	import { Button } from 'flowbite-svelte'
	import { i18n, t } from '$lib/i18n'
</script>

<Button class="gap-1 md:min-w-[110px]" color="alternative" size="xs" on:click={() => recordTrashModal.open()}>
	<i class="ti ti-recycle" />
	<span class="hidden md:block">{$t('recycle bin', { ns: 'table' })}</span>
</Button>
