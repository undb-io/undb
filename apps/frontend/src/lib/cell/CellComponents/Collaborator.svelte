<script lang="ts">
	import type { CollaboratorField, CollaboratorFieldValue, IRecordDisplayValues } from '@undb/core'
	import CollaboratorComponent from './CollaboratorComponent.svelte'
	import { getTable } from '$lib/store/table'

	export let value: CollaboratorFieldValue
	export let field: CollaboratorField
	export let displayValues: IRecordDisplayValues

	$: collaborators = value.unpack() ?? []
	$: values = field.getDisplayValues(displayValues)
</script>

{#if collaborators.length}
	{#each values as [username, avatar]}
		<CollaboratorComponent username={username ?? ''} {avatar} />
	{/each}
{/if}
