<script>
	import { Dropdown } from 'flowbite-svelte'
	import { IconCircleChevronDown } from '@tabler/icons-svelte'
	import { optionColorOrder, Option as CoreOption, OptionColor } from '@undb/core'
	import Option from '$lib/option/Option.svelte'
	import cx from 'classnames'

	let dropdownOpen = false
	export let value = OptionColor.defaultColorName
</script>

<button
	id="avatar_with_name"
	class={cx(
		'inline-flex text-white rounded-sm w-[28px] h-[28px] aspect-square justify-center items-center',
		`bg-${value}-500`,
	)}
	on:click|self|stopPropagation={() => (dropdownOpen = !dropdownOpen)}
>
	<IconCircleChevronDown class="text-white inline-flex justify-center items-center" size={12} />
</button>
<Dropdown bind:open={dropdownOpen} inline triggeredBy="#avatar_with_name" class="w-[100px] p-2 content-center">
	<div class="grid grid-cols-2 gap-y-1 gap-x-1 w-full place-items-center">
		{#each optionColorOrder as color}
			<button
				class="aspect-auto"
				on:click|stopPropagation={() => {
					value = color
					dropdownOpen = false
				}}
			>
				<Option
					option={CoreOption.create({
						name: 'a',
						color: OptionColor.create({ name: color, shade: OptionColor.defaultShade }),
					})}
				/>
			</button>
		{/each}
	</div>
</Dropdown>
