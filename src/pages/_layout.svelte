<script lang="ts">
	import { auth, user } from "$lib/firebase";
	import { ready } from "@roxi/routify";

	$: if ($user === null)
		(window as any).google.accounts.id.prompt((notification: any) => {
			if (
				notification.isDismissedMoment() &&
				notification.getDismissedReason() === "credential_returned" &&
				$user === null
			)
				$user = undefined;
		});
	function renderButton(el: HTMLDivElement) {
		(window as any).google.accounts.id.renderButton(el, {
			scope: "profile email",
			width: 240,
			height: 100,
			longtitle: true,
			theme: "filled_blue",
		});
	}

	// tell HMR not to wait for <slot> to render.
	$ready();
</script>

<header><span class="latin">fac simile</span> - Latin, "to make a copy"</header>

<main>
	{#if $user !== null && $user !== undefined}
		<slot />
	{:else if $user === null}
		<div id="google" use:renderButton />
	{/if}
</main>

<footer>
	{#if $user === null}
		You are logged out.
	{:else if $user === undefined}
		You are logging in...
	{:else}
		<!-- <img
			src={$user.photoURL ||
				"https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg"}
			alt="User-uploaded profile"
		/> -->
		You are <a href="/profile">{$user?.displayName}</a>.
		<a href={"#"} on:click={async () => await auth.signOut()}>Log out.</a>
	{/if}
</footer>

<style>
	div#google {
		transform: scale(1.5);
	}
</style>
