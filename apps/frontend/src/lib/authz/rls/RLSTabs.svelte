<script lang="ts">
	import { Tabs } from 'flowbite-svelte'
	import { rlsActions } from '@undb/authz'
	import RlsTab from './RLSTab.svelte'
</script>

<Tabs style="underline">
	{#each rlsActions as action}
		<RlsTab {action} />
	{/each}
</Tabs>
