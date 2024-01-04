<script>
    import "../styles/userDetails.scss";
    import Icon from '@iconify/svelte';
    import {cncfData,selectedCategory,getFullLogoUrl } from "../store/contentStore.js";
    import CardDetailsModal from "./CardDetailsModal.svelte";
    import { toggleFavorite } from "../store/favoritesStore.js";
    

    let selectedProject = null;

    function handleFavoriteClick(projectId, event) {
        console.log("Heart icon clicked for project ID:", projectId);
        event.stopPropagation();
        toggleFavorite(projectId);
    }

    function openProjectModal(project) {
        selectedProject = project;
    }

    function closeProjectModal() {
        selectedProject = null;
    }

export let sortBy;

$: filteredAndSortedData = $cncfData
        .filter(item => !$selectedCategory || item.category === $selectedCategory)
        .sort((a, b) => sortBy === 'starCount' ? b.stars - a.stars : 0);
</script>

<div class="content-main">
    {#if filteredAndSortedData.length === 0}
        <p>No data available.</p>
    {:else}
        <div class="card-grid">
            {#each filteredAndSortedData as item}
                <article
                    class="card"
                    on:click={() => openProjectModal(item)}
                    on:keydown={() => openProjectModal(item)}
                >
                    <div class="card-favorite">
                        <a
                            class="button"
                            on:click={(event) =>
                                handleFavoriteClick(item.id, event)}
                            on:keydown={(event) =>
                                handleFavoriteClick(item.id, event)}
                        >
                            <span><Icon icon="mdi:heart" /></span>
                        </a>
                    </div>
                    <div class="card-header">
                        <div>
                            <span
                                ><img
                                    src={getFullLogoUrl(item.href)}
                                    alt={item.name}
                                /></span
                            >
                            <h3>{item.name}</h3>
                        </div>
                    </div>
                    <div class="card-body">
                        <p>{item.description}</p>
                        {#if item.stars !== undefined}
                        <p class="small-text"><Icon icon="ic:baseline-star" class="icon" />{item.stars}</p>
                    {/if}
                    </div>
                    <div class="card-footer">
                        {#if item.repo_url}
                            <a href={item.repo_url} target="_blank"
                                >GitHub Repo</a
                            >
                        {/if}
                    </div>
                </article>
            {/each}
        </div>
    {/if}
    {#if selectedProject}
        <CardDetailsModal
            project={selectedProject}
            onClose={closeProjectModal}
        />
    {/if}
</div>
