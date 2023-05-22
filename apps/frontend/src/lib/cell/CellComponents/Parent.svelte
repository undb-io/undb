<script lang="ts">
	import type { IRecordDisplayValues, ParentField, ParentFieldValue } from '@undb/core'
	import ReferenceComponent from './ReferenceComponent.svelte'

	// export let value: ParentFieldValue
	export let field: ParentField
	export let displayValues: IRecordDisplayValues

	$: values = field.getDisplayValues(displayValues)
</script>

{#each values as value}
	<ReferenceComponent {value} />
{/each}
