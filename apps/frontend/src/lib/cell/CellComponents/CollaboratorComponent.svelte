<script lang="ts">
	import type { IColor } from '@undb/core'
	import CollaboratorAvatar from '$lib/user/CollaboratorAvatar.svelte'
	import type { Size } from '$components/ui/avatar'

	export let username: string
	export let avatar: string | undefined | null
	export let color: IColor

	export let size: Size | undefined = undefined
</script>

<CollaboratorAvatar {avatar} {color} {username} {size}>
	<p>{username}</p>
</CollaboratorAvatar>
