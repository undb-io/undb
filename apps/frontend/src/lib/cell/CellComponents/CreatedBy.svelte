<script lang="ts">
	import type { Record } from '@undb/core'
	import CollaboratorComponent from './CollaboratorComponent.svelte'

	export let record: Record

	$: value = record.createdByProfile
</script>

{#if value}
	<CollaboratorComponent username={value.username} color={value.color} avatar={value.avatar} />
{/if}
