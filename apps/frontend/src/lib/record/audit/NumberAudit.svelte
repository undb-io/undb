<script lang="ts">
	import type { IBaseFieldEventSchema } from '@undb/core'

	export let field: IBaseFieldEventSchema
	export let previousValue: number | undefined
	export let value: number | undefined
</script>

<div class="flex items-center gap-2 text-xs">
	<span class="line-through rounded-sm p-0.5 bg-red-200/50 border-red-200">{previousValue}</span>
	<span class="rounded-sm p-0.5 bg-green-200/50 border-green-200">{value}</span>
</div>
