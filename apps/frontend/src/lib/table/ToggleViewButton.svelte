<script lang="ts">
	import { Badge } from '$components/ui/badge'
	import Toggle from '$components/ui/toggle/toggle.svelte'
	import { t } from '$lib/i18n'
	import { viewsSideBarOpen } from '$lib/store/modal'
	import { getTable } from '$lib/store/table'

	const table = getTable()
	$: viewsCount = $table.views.count
</script>

<Toggle variant="outline" size="sm" class="text-xs gap-2" bind:pressed={$viewsSideBarOpen}>
	<i class="ti ti-menu-2"></i>
	<span>
		{$t('Views')}
	</span>
	{#if viewsCount > 1}
		<Badge variant="outline">{viewsCount}</Badge>
	{/if}
</Toggle>
