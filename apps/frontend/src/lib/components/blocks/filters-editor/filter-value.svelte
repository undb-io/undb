<script lang="ts">
	import type { Field } from '@undb/table';
	import FieldControl from '../field-control/field-control.svelte';

	export let field: Field;
	export let op: string;
	export let value: any | undefined = undefined;
	$: hasValue = field.isOpHasValue(op);

	$: if (!hasValue) {
		value = undefined;
	}
</script>

{#if hasValue}
	<FieldControl bind:value {field} class="h-8 rounded-l-none border-l-0 py-0" />
{/if}
