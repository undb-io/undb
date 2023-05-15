<script lang="ts">
	import { P } from 'flowbite-svelte'
	import { t } from '$lib/i18n'
	import AddWidgeButton from '$lib/table/AddWidgeButton.svelte'
</script>

<div class="flex-1 w-full flex flex-col gap-4 items-center justify-center content-center">
	<P weight="bold">{$t('add widge')}</P>

	<AddWidgeButton size="md" color="blue" outline={false} class="w-40" />
</div>
