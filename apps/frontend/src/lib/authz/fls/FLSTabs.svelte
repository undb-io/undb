<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs'
	import { flsActions } from '@undb/authz'
	import FlsTab from './FLSTab.svelte'
	import { t } from '$lib/i18n'
</script>

<Tabs.Root value={flsActions[0]}>
	<Tabs.List>
		{#each flsActions as action}
			<Tabs.Trigger value={action}>
				{$t(action, { ns: 'authz' })}
			</Tabs.Trigger>
		{/each}
	</Tabs.List>
	{#each flsActions as action}
		<FlsTab {action} />
	{/each}
</Tabs.Root>
