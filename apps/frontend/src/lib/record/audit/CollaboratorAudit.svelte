<script lang="ts">
	import CollaboratorComponent from '$lib/cell/CellComponents/CollaboratorComponent.svelte'
	import type { IBaseFieldEventSchema, ICollaboratorReadableValueSchema } from '@undb/core'
	import { differenceBy } from 'lodash-es'

	export let field: IBaseFieldEventSchema
	export let previousValue: ICollaboratorReadableValueSchema | undefined
	export let value: ICollaboratorReadableValueSchema | undefined
	$: removed = differenceBy(previousValue, value ?? [], 'id')
	$: added = differenceBy(value, previousValue ?? [], 'id')
</script>

<div class="text-sm space-y-2">
	{#if removed?.length}
		<div class="line-through rounded-sm p-2 bg-red-200/50 border-red-200 inline-flex items-center gap-2">
			{#each removed as ro}
				<CollaboratorComponent avatar={ro.avatar} size="xs" username={ro.username} color={ro.color} />
			{/each}
		</div>
	{/if}
	{#if added?.length}
		<div class="rounded-sm p-2 bg-green-200/50 border-green-200 inline-flex items-center gap-2">
			{#each added as ro}
				<CollaboratorComponent avatar={ro.avatar} size="xs" username={ro.username} color={ro.color} />
			{/each}
		</div>
	{/if}
</div>
