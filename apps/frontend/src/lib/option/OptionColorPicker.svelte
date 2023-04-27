<script>
	import { optionColorOrder, Option as CoreOption, OptionColor } from '@undb/core'
	import { Dropdown, Radio } from 'flowbite-svelte'
	import Option from '$lib/option/Option.svelte'
	import cx from 'classnames'
	import { Portal } from '@rgossiaux/svelte-headlessui'
	import { colors } from '$lib/field/helpers'

	export let value = OptionColor.defaultColorName
	export let name = 'a'

	let open = false
	$: selected = colors[value]
</script>

<div
	role="button"
	on:click|preventDefault
	id="option_color_picker"
	class={cx(
		'inline-flex text-white rounded-sm  w-[28px] h-[28px] aspect-square justify-center items-center cursor-pointer',
		selected,
		$$restProps.class,
	)}
>
	<i class="ti ti-circle-chevron-down text-sm" />
</div>
<Portal target="body">
	<Dropdown
		triggeredBy="#option_color_picker"
		bind:open
		inline
		class="max-h-64 min-w-[200px] p-2 grid grid-cols-2 gap-2 overflow-y-auto py-1 shadow-md"
		frameClass="z-[100]"
	>
		{#each optionColorOrder as color}
			<Radio value={color} bind:group={value} custom on:change={() => (open = false)}>
				<Option
					option={CoreOption.create({
						name: name || 'a',
						color: OptionColor.create({ name: color, shade: OptionColor.defaultShade }),
					})}
					class="!block w-full h-full"
					role="button"
				/>
			</Radio>
		{/each}
	</Dropdown>
</Portal>
