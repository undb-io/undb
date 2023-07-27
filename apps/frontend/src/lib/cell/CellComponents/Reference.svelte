<script lang="ts">
	import type { IRecordDisplayValues, ReferenceField, ReferenceFieldValue } from '@undb/core'
	import ReferenceComponent from './ReferenceComponent.svelte'

	export let value: ReferenceFieldValue | undefined
	export let field: ReferenceField
	export let displayValues: IRecordDisplayValues

	$: unpacked = value?.unpack() ?? []
	$: values = field.getDisplayValues(displayValues)
</script>

{#if unpacked.length}
	{#if !values.length}
		<div class="flex items-center space-x-2 text-gray-400 font-light">
			{#each unpacked as value}
				<ReferenceComponent value={[null]} />
			{/each}
		</div>
	{:else}
		<div class="flex items-center space-x-2 text-gray-800 dark:text-gray-300 font-medium">
			{#each values as value}
				<ReferenceComponent {value} />
			{/each}
		</div>
	{/if}
{/if}
