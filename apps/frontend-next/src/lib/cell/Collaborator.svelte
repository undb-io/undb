<script lang="ts">
	import { Avatar, P } from 'flowbite-svelte'

	export let username: string
	export let avatar: string | undefined | null

	export let size: 'xs' | 'sm' | 'lg' | 'xl' | undefined = 'xs'
</script>

<span class="inline-flex gap-2 items-center">
	{#if !avatar}
		<Avatar {size}>{username.slice(0, 2)}</Avatar>
	{:else}
		<Avatar {size} src={avatar} alt={username}>{username.slice(0, 2)}</Avatar>
	{/if}
	<P {size}>{username}</P>
</span>
