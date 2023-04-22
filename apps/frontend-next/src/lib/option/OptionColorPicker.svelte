<script>
	import { IconCircleChevronDown } from '@tabler/icons-svelte'
	import { optionColorOrder, Option as CoreOption, OptionColor } from '@undb/core'
	import Option from '$lib/option/Option.svelte'
	import cx from 'classnames'
	import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@rgossiaux/svelte-headlessui'

	export let value = OptionColor.defaultColorName
</script>

<Listbox class="relative" {value} on:change={(e) => (value = e.detail)}>
	<ListboxButton
		class={cx(
			'inline-flex text-white rounded-sm  w-[28px] h-[28px] aspect-square justify-center items-center',
			`bg-${value}-500`,
			$$restProps.class,
		)}
	>
		<IconCircleChevronDown size={14} />
	</ListboxButton>
	<ListboxOptions
		class="fixed bg-white py-1 px-3 border border-gray-100 shadow-md h-64 overflow-y-auto z-50 grid grid-cols-2 gap-y-1 gap-x-3 place-items-center"
	>
		{#each optionColorOrder as color}
			<ListboxOption value={color} class="h-6 aspect-square cursor-pointer">
				<Option
					option={CoreOption.create({
						name: 'a',
						color: OptionColor.create({ name: color, shade: OptionColor.defaultShade }),
					})}
					class="w-full h-full"
				/>
			</ListboxOption>
		{/each}
	</ListboxOptions>
</Listbox>
