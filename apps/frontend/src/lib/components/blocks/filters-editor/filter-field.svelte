<script lang="ts">
	import type { MaybeFieldFilter } from '@undb/table';
	import FieldPicker from '../field-picker/field-picker.svelte';

	export let value: MaybeFieldFilter;
</script>

<FieldPicker bind:value={value.fieldId} {...$$restProps} />
