<script lang="ts">
    import { user, db } from "$lib/firebase";
    import { debounce } from "debounce";
    import { EmojiButton } from "@joeattardi/emoji-button";
    import {
        doc,
        setDoc,
        onSnapshot,
        DocumentReference,
    } from "@firebase/firestore";
    import type { DocumentData } from "firebase/firestore";
    import { writable } from "svelte/store";
    import type { Writable } from "svelte/store";

    function docToStore(doc: DocumentReference) {
        const { subscribe, set, update } = writable<DocumentData | undefined>(
            undefined
        );
        const saved: Writable<Boolean | undefined> = writable(undefined);
        const debouncedUpdate = debounce((pushDoc: DocumentData) => {
            saved.set(true);
            setDoc(doc, pushDoc);
        }, 1000);
        onSnapshot(doc, (pullDoc) => set(pullDoc.data()));
        return {
            subscribe,
            saved,
            set: (pushDoc: DocumentData) => {
                saved.set(false);
                debouncedUpdate(pushDoc);
            },
        };
    }

    const profile = docToStore(doc(db, "users", $user!.uid));
    const profileSaved = profile.saved;
    const picker = new EmojiButton();

    picker.on("emoji", (selection) => {
        $profile!.emoji = selection.emoji;
    });
</script>

{#if $profile === undefined}
    Loading profile...
{:else}
    <form>
        <fieldset>
            <legend>
                {#if $profileSaved === true}
                    All changes saved.
                {:else if $profileSaved === false}
                    Saving changes.
                {:else}
                    Edit your profile:
                {/if}</legend
            >
            <label for="emoji">Profile icon</label>
            <input
                type="button"
                name="emoji"
                value={$profileSaved === false ? "⏱" : $profile.emoji}
                on:click={(e) => picker.togglePicker(e.target)}
            /><br />
            <label for="bio">User bio</label>
            <input name="bio" bind:value={$profile.bio} />
        </fieldset>
    </form>
{/if}

<svelte:window
    on:beforeunload={$profileSaved === false
        ? (e) => {
              e.preventDefault();
              e.returnValue = "";
          }
        : undefined}
/>

<style>
    input[name="emoji"] {
        font-size: 200%;
    }
</style>
