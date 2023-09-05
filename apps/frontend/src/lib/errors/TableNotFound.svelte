<script lang="ts">
	import { t } from '$lib/i18n'
	import { ERR_TABLE_NODE_FOUND } from '@undb/core'
	import * as Alert from '$lib/components/ui/alert'
	import { Button } from '$lib/components/ui/button'
</script>

<div class="flex flex-col gap-4 items-center">
	<i class="ti ti-alert-triangle text-3xl text-gray-700" />

	<Alert.Root variant="destructive">
		<Alert.Title>
			404 - {$t(ERR_TABLE_NODE_FOUND, { ns: 'errors' })}
		</Alert.Title>
	</Alert.Root>

	<Button href="/" class="w-full">
		{$t('return to home', { ns: 'common' })}
	</Button>
</div>
