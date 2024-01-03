<script>
    import Icon from '@iconify/svelte';
    import { onMount } from 'svelte';
    import { getFullLogoUrl } from '../store/contentStore.js';
    import { Chart, registerables } from 'chart.js';
    Chart.register(...registerables);

    export let project;
    export let onClose;
    let chartCanvas;

    onMount(() => {
        if (project.github_data && project.github_data.languages) {
            const ctx = chartCanvas.getContext('2d');
            const chartData = {
                labels: project.github_data.languages.map(lang => lang.name),
                datasets: [{
                    data: project.github_data.languages.map(lang => lang.value),
                    backgroundColor: project.github_data.languages.map(lang => lang.color || '#999999') 
                }]
            };
            new Chart(ctx, {
                type: 'pie',
                data: chartData
            });
        }
    });

    function closeModal() {
        onClose();
    }
</script>

{#if project}
    <div class="modal-overlay" on:click={closeModal} on:keydown={closeModal}>
        <div class="modal-content" on:click|stopPropagation on:keydown|stopPropagation>
            <div class="modal-grid">
                <div class="left-column">
            <button class="close-button" on:click={closeModal} on:keydown={closeModal}>&times;</button>
            <div class="project-details">
                <div class="card-header">
                    <div>
                        <span><img src={getFullLogoUrl(project.href)} alt={project.name} /></span>
                        <h3>{project.name}</h3>
                    </div>
                </div>
                <div class="chart-container">
                    <canvas bind:this={chartCanvas}></canvas>
                </div>
                <div class="right-column">
                <p>{project.description}</p>
                </div>
            </div>
                <div class="additional-info">
                    {#if project.website}
                        <p class="small-text">Website: <a href={project.website} target="_blank">{project.website}</a></p>
                    {/if}
                    {#if project.repo_url}
                    <p class="small-text">
                        <a class="icons" href={project.repo_url} target="_blank">
                            <Icon icon="bi:github" class="icon" />
                            {project.repo_url}
                        </a>
                    </p>
                {/if}
                    {#if project.stars}
                        <p class="small-text"><Icon icon="ic:baseline-star" class="icon" />{project.stars}</p>
                    {/if}
                </div>
            </div>
        </div>
    </div>
    </div>
{/if}