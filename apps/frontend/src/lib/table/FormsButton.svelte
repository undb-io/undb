<script lang="ts">
	import { t } from '$lib/i18n'
	import { formListDrawer } from '$lib/store/drawer'
	import { Button } from '$components/ui/button'
</script>

<Button size="sm" on:click={() => formListDrawer.open()} class="whitespace-nowrap">{$t('forms')}</Button>
