<script lang="ts">
	import { Badge } from '$components/ui/badge'
	import { t } from '$lib/i18n'
	import { readonlyRecord } from '$lib/store/table'
</script>

{#if $readonlyRecord}
	<Badge class="border-yellow-600 text-yellow-500 bg-yellow-50">{$t('readonly', { ns: 'common' })}</Badge>
{/if}
