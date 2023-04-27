<script lang="ts">
	import type { Option } from '@undb/core'
	import cx from 'classnames'

	export let option: Option

	const textColor = option.color.shade > 5 ? '!text-dark' : '!text-white'
	const color =
		option.color.shade === 0 ? `bg-${option.color.name}-50` : `bg-${option.color.name}-${option.color.shade}00`
</script>

<div
	{...$$restProps}
	data-option-id={option.key.value}
	class={cx(
		textColor,
		'text-xs inline-block font-medium mr-2 px-2.5 py-0.5 rounded text-center overflow-hidden text-ellipsis whitespace-nowrap',
		$$restProps.class,
		color,
	)}
>
	{option.name.value}
</div>
