<script lang="ts">
	import { recordTrashModal } from '$lib/store/modal'
	import { Button } from 'flowbite-svelte'
	import { t } from '$lib/i18n'
</script>

<Button class="gap-1" color="alternative" size="xs" on:click={() => recordTrashModal.open()}>
	<i class="ti ti-recycle" />
	<span class="hidden lg:block truncate">{$t('recycle bin', { ns: 'table' })}</span>
</Button>
