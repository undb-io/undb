<script lang="ts">
	import { cn } from '$lib/utils'
	import type { IColor } from '@undb/core'
	import * as Avatar from '$lib/components/ui/avatar'
	import { colors } from '$lib/field/helpers'

	export let username: string
	export let avatar: string | undefined | null
	export let color: IColor

	export let size: Avatar.Size | undefined = undefined
</script>

<span class="inline-flex gap-2 items-center">
	<Avatar.Root {size}>
		<Avatar.Image src={avatar} alt={username} />
		<Avatar.Fallback class={cn('text-white', colors[color])}>{username.slice(0, 2)}</Avatar.Fallback>
	</Avatar.Root>

	<slot />
</span>
