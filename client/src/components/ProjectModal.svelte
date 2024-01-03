<script>
    export let searchResults;
    export let onClose;
    import { getFullLogoUrl } from "../store/contentStore.js";
</script>

{#if searchResults.length}
    <div class="modal-overlay" on:click={onClose} on:keydown={onClose}>
        <div
            class="modal-content"
            on:click|stopPropagation
            on:keydown|stopPropagation
        >
            <button class="close-button" on:click={onClose} on:keydown={onClose}
                >&times;</button
            >
            <div class="results">
                {#each searchResults as project}
                    <div class="card">
                        {#if project.logo}
                            <img
                                src={getFullLogoUrl(project.href)}
                                alt={project.name || "No Name"}
                                class="card-logo"
                            />
                        {/if}
                        <div class="card-content">
                            <h3>{project.name || "No Name"}</h3>
                            {#if project.description}
                                <p class="project-description">
                                    {project.description}
                                </p>
                            {:else}
                                <p class="project-description">
                                    No description available.
                                </p>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
{/if}
