<script lang="ts">
	import { t } from '$lib/i18n'
	import { Button } from '$components/ui/button'
	import { formListDrawer } from '$lib/store/modal'
</script>

<Button size="sm" on:click={() => formListDrawer.open()} class="whitespace-nowrap gap-2">
	<i class="ti ti-clipboard-text"></i>
	{$t('forms')}
</Button>
