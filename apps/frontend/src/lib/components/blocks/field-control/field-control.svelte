<script lang="ts">
	import type { Field } from '@undb/table';
	import StringControl from './string-control.svelte';
	import NumberControl from './number-control.svelte';
	import type { ComponentType } from 'svelte';

	export let field: Field;

	export let value: any;

	// TODO: key type
	const map: Record<string, ComponentType> = {
		string: StringControl,
		number: NumberControl
	};
</script>

<svelte:component this={map[field.type]} bind:value {...$$restProps} />
