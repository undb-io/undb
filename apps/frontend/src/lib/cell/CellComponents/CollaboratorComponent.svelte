<script lang="ts">
	import type { IColor } from '@undb/core'
	import CollaboratorAvatar from '$lib/user/CollaboratorAvatar.svelte'

	export let username: string
	export let avatar: string | undefined | null
	export let color: IColor

	export let size: 'xs' | 'sm' | 'lg' | 'xl' | undefined = 'xs'
</script>

<CollaboratorAvatar {avatar} {color} {username} {size}>
	<p>{username}</p>
</CollaboratorAvatar>
