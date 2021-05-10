<script lang="ts">
    import { getProfile } from "$lib/firebase";
    import { debounce } from "$lib/utils";
    import { EmojiButton } from "@joeattardi/emoji-button";

    const profile = getProfile();
    let bioSaved: Boolean | undefined = undefined;
    const picker = new EmojiButton();

    picker.on("emoji", (selection) => {
        $profile!.emoji = selection.emoji;
    });

    const updateBio = debounce((bio: String) => {
        bioSaved = true;
        $profile!.bio = bio;
    }, 700);

    const bioOnInput = (
        e: Event & {
            currentTarget: EventTarget & HTMLInputElement;
        }
    ) => {
        bioSaved = false;
        updateBio(e.currentTarget.value);
    };
    const emojiPick = (
        e: MouseEvent & {
            currentTarget: EventTarget & HTMLInputElement;
        }
    ) => picker.togglePicker(e.currentTarget);
    let bioInput: HTMLInputElement;
</script>

{#if $profile === undefined}
    Loading profile...
{:else}
    <form on:submit={(e) => e.preventDefault()}>
        <fieldset>
            <legend>Your profile</legend>
            <label for="emoji">Profile icon:</label>
            <input
                type="button"
                name="emoji"
                value={$profile.emoji}
                on:click={emojiPick}
            /><br />
            <label for="bio">About you:</label>
            <!-- <input name="bio" bind:value={$profile.bio} /> -->
            <input
                name="bio"
                type="text"
                bind:this={bioInput}
                value={$profile.bio}
                on:input={bioOnInput}
            />
            {#if bioSaved === true}
                (saved.)
            {:else if bioSaved === false}
                (saving...)
            {/if}<br />
            <input type="button" name="autosave" value="Autosave" />
            <!-- on:click={(e) => {
                e.currentTarget.value =
                    "Autosaves - no need to click the save button.";
                e.currentTarget.disabled = true;
            }}-->
        </fieldset>
    </form>
{/if}

<svelte:window
    on:beforeunload={bioSaved === false
        ? (e) => {
              e.preventDefault();
              e.returnValue = "";
          }
        : undefined}
/>

<svelte:head>
    <title>funfax | profile</title>
</svelte:head>

<style>
    form {
        line-height: 200%;
        min-width: 90%;
    }
</style>
