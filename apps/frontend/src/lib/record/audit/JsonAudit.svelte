<script lang="ts">
	import type { IBaseFieldEventSchema } from '@undb/core'

	export let field: IBaseFieldEventSchema
	export let previousValue: object | undefined
	export let value: object | undefined
</script>

<div class="flex items-center gap-2 text-sm">
	<span class="line-through rounded-sm p-0.5 bg-red-200/50 border-red-200">{JSON.stringify(previousValue ?? null)}</span
	>
	<span class="rounded-sm p-0.5 bg-green-200/50 border-green-200">{JSON.stringify(value ?? null)}</span>
</div>
