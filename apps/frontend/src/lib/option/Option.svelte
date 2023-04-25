<script lang="ts">
	import type { Option } from '@undb/core'
	import cx from 'classnames'
	import { Badge } from 'flowbite-svelte'

	export let option: Option

	const textColor = option.color.shade > 5 ? '!text-dark' : '!text-white'
</script>

<span
	{...$$restProps}
	class={cx(
		`bg-${option.color.name}-${option.color.shade * 100}`,
		textColor,
		'text-xs font-medium mr-2 px-2.5 py-0.5 rounded',
	)}
>
	{option.name.value}
</span>
