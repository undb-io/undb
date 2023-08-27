<script lang="ts">
	import { Tabs } from 'flowbite-svelte'
	import { flsActions } from '@undb/authz'
	import FlsTab from './FLSTab.svelte'
</script>

<Tabs style="underline">
	{#each flsActions as action}
		<FlsTab {action} />
	{/each}
</Tabs>
