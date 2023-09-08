<script lang="ts">
	import { Button } from '$components/ui/button'
	import { t } from '$lib/i18n'
</script>

<div class="w-full h-full flex flex-col items-center justify-center gap-2">
	<h3 class="text-lg font-bold">{$t('Empty Api Token', { ns: 'openapi' })}</h3>
	<Button class="w-56 gap-2">
		<i class="ti ti-plus"></i>
		{$t('Create New Token', { ns: 'openapi' })}
	</Button>
</div>
