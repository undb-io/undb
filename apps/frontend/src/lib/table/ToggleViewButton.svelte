<script lang="ts">
	import Toggle from '$components/ui/toggle/toggle.svelte'
	import { t } from '$lib/i18n'
	import { viewsSideBarOpen } from '$lib/store/modal'
</script>

<Toggle variant="outline" size="sm" class="text-xs gap-2" bind:pressed={$viewsSideBarOpen}>
	<i class="ti ti-menu-2"></i>
	<span>
		{$t('Views')}
	</span>
</Toggle>
