<script lang="ts">
	import { rlsActions } from '@undb/authz'
	import RlsTab from './RLSTab.svelte'
	import * as Tabs from '$components/ui/tabs'
	import RlsTabTrigger from './RLSTabTrigger.svelte'
</script>

<Tabs.Root style="underline">
	<Tabs.List>
		{#each rlsActions as action}
			<Tabs.Trigger value={action}>
				<RlsTabTrigger {action} />
			</Tabs.Trigger>
		{/each}
	</Tabs.List>
	{#each rlsActions as action}
		<Tabs.Content value={action}>
			<RlsTab {action} />
		</Tabs.Content>
	{/each}
</Tabs.Root>
