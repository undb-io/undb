<script lang="ts">
	import type { CollaboratorField, CollaboratorFieldValue, IRecordDisplayValues } from '@undb/core'
	import CollaboratorComponent from './CollaboratorComponent.svelte'

	export let value: CollaboratorFieldValue | undefined
	export let field: CollaboratorField
	export let displayValues: IRecordDisplayValues

	$: collaborators = value?.unpack() ?? []
	$: values = field.getDisplayValues(displayValues)
</script>

{#if collaborators.length}
	{#each values as [username, avatar, color]}
		<CollaboratorComponent username={username ?? ''} {avatar} {color} />
	{/each}
{/if}
