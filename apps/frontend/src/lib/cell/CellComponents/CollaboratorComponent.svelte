<script lang="ts">
	import cx from 'classnames'
	import type { IColor } from '@undb/core'
	import { Avatar, P } from 'flowbite-svelte'
	import { colors } from '$lib/field/helpers'

	export let username: string
	export let avatar: string | undefined | null
	export let color: IColor

	export let size: 'xs' | 'sm' | 'lg' | 'xl' | undefined = 'xs'
</script>

<span class="inline-flex gap-2 items-center">
	{#if !avatar}
		<Avatar {size} class={cx(colors[color], 'text-white')}>{username.slice(0, 2)}</Avatar>
	{:else}
		<Avatar {size} src={avatar} alt={username}>{username.slice(0, 2)}</Avatar>
	{/if}
	<P {size}>{username}</P>
</span>
