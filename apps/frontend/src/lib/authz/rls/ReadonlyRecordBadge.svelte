<script lang="ts">
	import { t } from '$lib/i18n'
	import { readonlyRecord } from '$lib/store/table'
	import { Badge } from 'flowbite-svelte'
</script>

{#if $readonlyRecord}
	<Badge color="yellow">{$t('readonly', { ns: 'common' })}</Badge>
{/if}
