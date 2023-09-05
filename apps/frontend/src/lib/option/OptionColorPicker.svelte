<script>
	import { optionColorOrder, Option as CoreOption, OptionColor } from '@undb/core'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import Option from '$lib/option/Option.svelte'
	import cx from 'classnames'
	import { colors } from '$lib/field/helpers'

	export let value = OptionColor.defaultColorName
	export let name = 'a'

	$: selected = colors[value]
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild>
		<div
			class={cx(
				'inline-flex text-white w-[30px] h-[30px] aspect-square justify-center items-center cursor-pointer rounded-sm',
				selected,
				$$restProps.class,
			)}
		>
			<i class="ti ti-circle-chevron-down text-sm" />
		</div>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.RadioGroup bind:value>
			{#each optionColorOrder as color}
				<DropdownMenu.RadioItem value={color}>
					<Option
						option={CoreOption.create({
							name: name || 'a',
							color: OptionColor.create({
								name: color,
								shade: OptionColor.defaultShade,
							}),
						})}
					/>
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
