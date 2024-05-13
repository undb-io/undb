<script lang="ts">
	import type { Field } from '@undb/table';
	import FieldControl from '../field-control/field-control.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	export let field: Field | undefined;
	export let op: string | undefined;
	export let value: any | undefined = undefined;
	$: hasValue = op ? field?.isOpHasValue(op) ?? false : false;

	$: if (!hasValue) {
		value = undefined;
	}
</script>

{#if field && hasValue}
	<FieldControl bind:value {field} class="h-8 rounded-l-none border-l-0 py-0" />
{:else}
	<Input disabled class="h-8 rounded-l-none border-l-0 py-0" placeholder="select a field" />
{/if}
