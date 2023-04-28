<script lang="ts">
	import { colors } from '$lib/field/helpers'
	import type { Option } from '@undb/core'
	import cx from 'classnames'

	export let option: Option

	const textColor = option.color.shade > 5 ? '!text-dark' : '!text-white'
</script>

<span
	{...$$restProps}
	data-option-id={option.key.value}
	class={cx(
		textColor,
		'text-xs inline-flex items-center justify-center px-2.5 py-0.5 rounded text-center overflow-hidden text-ellipsis whitespace-nowrap',
		$$restProps.class,
		colors[option.color.name],
	)}
>
	{option.name.value}
</span>
