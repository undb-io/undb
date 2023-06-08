<script lang="ts">
	import { t } from '$lib/i18n'
	import { ERR_TABLE_NODE_FOUND } from '@undb/core'
	import { Alert, Button } from 'flowbite-svelte'
</script>

<div class="flex flex-col gap-4 items-center">
	<i class="ti ti-alert-triangle text-3xl text-gray-700" />
	<Alert color="yellow" class="w-full">404 - {$t(ERR_TABLE_NODE_FOUND, { ns: 'errors' })}</Alert>
	<Button href="/" class="w-full">
		{$t('return to home', { ns: 'common' })}
	</Button>
</div>
