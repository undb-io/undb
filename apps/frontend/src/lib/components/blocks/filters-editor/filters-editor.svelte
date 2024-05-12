<script lang="ts">
	import type { MaybeFilterGroup } from '@undb/table';
	import FieldPicker from '../field-picker/field-picker.svelte';

	export let value: MaybeFilterGroup | undefined;

	function addFilter() {
		if (!value) {
			value = {
				children: [{}],
				conjunction: 'and'
			};
		}
	}
</script>

<FieldPicker />
