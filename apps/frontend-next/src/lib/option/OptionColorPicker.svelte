<script>
	import { Dropdown, Radio } from 'flowbite-svelte'
	import { IconCircleChevronDown } from '@tabler/icons-svelte'
	import { optionColorOrder, Option as CoreOption, OptionColor } from '@undb/core'
	import Option from '$lib/option/Option.svelte'
	import cx from 'classnames'

	export let value = OptionColor.defaultColorName
</script>

<div
	class={cx(
		'inline-flex text-white rounded-sm w-[28px] h-[28px] aspect-square justify-center items-center',
		`bg-${value}-500`,
		$$restProps.class,
	)}
>
	<IconCircleChevronDown class="text-white inline-flex justify-center items-center" size={12} />
</div>
<Dropdown class="w-[100px] p-2 content-center">
	<div class="grid grid-cols-2 gap-y-1 gap-x-1 w-full place-items-center">
		{#each optionColorOrder as color}
			<Radio value={color} bind:group={value} custom>
				<Option
					option={CoreOption.create({
						name: 'a',
						color: OptionColor.create({ name: color, shade: OptionColor.defaultShade }),
					})}
				/>
			</Radio>
		{/each}
	</div>
</Dropdown>
