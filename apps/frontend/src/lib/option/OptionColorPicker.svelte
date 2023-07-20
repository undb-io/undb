<script>
	import { optionColorOrder, Option as CoreOption, OptionColor } from '@undb/core'
	import { Dropdown, Radio, Button } from 'flowbite-svelte'
	import Option from '$lib/option/Option.svelte'
	import cx from 'classnames'
	import { colors } from '$lib/field/helpers'

	export let value = OptionColor.defaultColorName
	export let name = 'a'

	let open = false
	$: selected = colors[value]
</script>

<div
	class={cx(
		'inline-flex text-white w-[30px] h-[30px] aspect-square justify-center items-center cursor-pointer rounded-sm',
		selected,
		$$restProps.class,
	)}
>
	<i class="ti ti-circle-chevron-down text-sm" />
</div>
<Dropdown style="z-index: 50;" bind:open inline class="w-[200px] z-[999999]">
	<div class="grid grid-cols-2 gap-2 overflow-y-auto shadow-md w-full h-full p-3">
		{#each optionColorOrder as color}
			<Radio class="h-[24px]" value={color} bind:group={value} custom on:change={() => (open = false)}>
				<Option
					option={CoreOption.create({
						name: name || 'a',
						color: OptionColor.create({ name: color, shade: OptionColor.defaultShade }),
					})}
					class="w-full h-full !text-sm"
					role="button"
				/>
			</Radio>
		{/each}
	</div>
</Dropdown>
