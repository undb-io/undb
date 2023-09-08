<script lang="ts">
	import { t } from '$lib/i18n'
	import AddWidgetButton from '$lib/table/AddWidgetButton.svelte'
</script>

<div class="flex-1 w-full flex flex-col gap-4 items-center justify-center content-center">
	<p class="font-bold">{$t('add widget')}</p>

	<AddWidgetButton size="md" color="blue" outline={false} class="w-40" />
</div>
