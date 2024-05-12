<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import FieldPicker from '../field-picker/field-picker.svelte';
	import { FilterIcon } from 'lucide-svelte';
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} size="xs">
			<FilterIcon class="mr-2 h-3 w-3" />
			Filters
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-80" align="start">
		<FieldPicker />
	</Popover.Content>
</Popover.Root>
