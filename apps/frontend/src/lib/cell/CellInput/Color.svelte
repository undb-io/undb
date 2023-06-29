<script lang="ts">
	import cx from 'classnames'
	export let value: string | undefined = undefined
</script>

<div {...$$restProps} class={cx('inline-flex items-center gap-2 px-2 text-sm', $$restProps.class)}>
	<input bind:value class="rounded-sm" autocomplete="off" type="color" readonly={$$restProps.readonly} />
	<span>{value ?? ''}</span>
</div>
