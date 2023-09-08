<script lang="ts">
	import { colors } from '$lib/field/helpers'
	import type { IOptionColor } from '@undb/core'
	import { cn } from '$lib/utils'

	export let id: string
	export let name: string
	export let color: IOptionColor

	const textColor = color.shade > 5 ? '!text-dark' : '!text-white'
</script>

<span
	{...$$restProps}
	data-option-id={id}
	class={cn(textColor, 'text-xs px-2.5 py-0.5 rounded text-center truncate', $$restProps.class, colors[color.name])}
>
	{name}
</span>
