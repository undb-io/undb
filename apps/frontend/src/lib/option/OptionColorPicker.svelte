<script>
	import { optionColorOrder, Option as CoreOption, OptionColor } from '@undb/core'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import Option from '$lib/option/Option.svelte'
	import { cn } from '$lib/utils'
	import { colors } from '$lib/field/helpers'

	export let value = OptionColor.defaultColorName
	export let name = 'a'

	$: selected = colors[value]
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<div
			class={cn(
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
			<div class="grid grid-cols-2 gap-2 overflow-y-auto w-full h-full">
				{#each optionColorOrder as color}
					<DropdownMenu.RadioItem value={color}>
						<Option
							class="w-full"
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
			</div>
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
