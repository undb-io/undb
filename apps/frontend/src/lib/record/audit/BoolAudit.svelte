<script lang="ts">
	import { Checkbox } from '$components/ui/checkbox'
	import type { IBaseFieldEventSchema } from '@undb/core'

	export let field: IBaseFieldEventSchema
	export let previousValue: boolean | undefined
	export let value: boolean | undefined
</script>

<div class="flex items-center gap-2 text-sm">
	<span class="line-through rounded-sm p-0.5 bg-red-200/50 border-red-200">
		<Checkbox checked={previousValue} disabled />
	</span>
	<span class="rounded-sm p-0.5 bg-green-200/50 border-green-200">
		<Checkbox checked={value} disabled />
	</span>
</div>
