<script lang="ts">
	import { t } from '$lib/i18n'
	import { formListDrawer } from '$lib/store/drawer'
	import { Button } from 'flowbite-svelte'
</script>

<Button size="xs" on:click={() => formListDrawer.open()}>{$t('forms')}</Button>
