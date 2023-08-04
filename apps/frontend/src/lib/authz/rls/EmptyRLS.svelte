<script lang="ts">
	import { t } from '$lib/i18n'
	import { getTable } from '$lib/store/table'
	import { P } from 'flowbite-svelte'

	const table = getTable()
</script>

<div class="h-20 w-full flex items-center justify-center">
	<P weight="bold">{$t('Empty RLS', { ns: 'authz', tableName: $table.name.value })}</P>
</div>
