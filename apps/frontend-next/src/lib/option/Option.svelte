<script lang="ts">
	import type { Option } from '@undb/core'
	import cx from 'classnames'
	import { Badge } from 'flowbite-svelte'

	export let option: Option

	const textColor = option.color.shade > 5 ? '!text-dark' : '!text-white'
</script>

<Badge
	{...$$restProps}
	class={cx(`bg-${option.color.name}-${option.color.shade * 100}`, textColor, 'select-none', $$restProps.class)}
>
	{option.name.value}
</Badge>
