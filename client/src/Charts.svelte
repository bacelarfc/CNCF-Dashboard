<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    let cncfData = [];
    let starsChart = null;
    let contributionsChart = null;
    let categoriesChart = null;
    let starsChartElement;
    let contributionsChartElement;
    let categoriesChartElement;

    onMount(async () => {
        try {
            const response = await fetch('http://localhost:8081/api/cncf-data');
            if (response.ok) {
                cncfData = await response.json();
                createStarsChart();
                createContributionsChart();
                createCategoriesChart();
            } else {
                console.error('Error fetching data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    function createStarsChart() {
        const sortedData = cncfData.sort((a, b) => b.stars - a.stars).slice(0, 10); 
        const ctx = starsChartElement.getContext('2d');
        starsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedData.map(item => item.name), 
                datasets: [{
                    label: 'Stars',
                    data: sortedData.map(item => item.stars),
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }]
            },
            options: { scales: { y: { beginAtZero: true } } }
        });
    }

    function createContributionsChart() {
    const sortedData = cncfData.sort((a, b) => b.contributions - a.contributions).slice(0, 10); 
    console.log("Sorted Data for Contributions Chart:", sortedData);

    if (sortedData.length === 0) {
        console.error("No data available for Contributions Chart.");
        return;
    }

    const ctx = contributionsChartElement.getContext('2d');
    contributionsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedData.map(item => item.name),
            datasets: [{
                label: 'Contributions',
                data: sortedData.map(item => item.contributions),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: { scales: { y: { beginAtZero: true } } }
    });
}

function createCategoriesChart() {
    const categoryCounts = cncfData.reduce((acc, item) => {
        const category = item.category || 'Unknown'; 
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    const ctx = categoriesChartElement.getContext('2d');
    categoriesChart = new Chart(ctx, {
        type: 'pie', 
        data: {
            labels: Object.keys(categoryCounts),
            datasets: [{
                label: 'Category Distribution',
                data: Object.values(categoryCounts),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1
            }]
        }
    });
}

</script>

<main>
    <h1>CNCF Project Data Visualizations</h1>
    <div>
        <h2>Top Starred Projects</h2>
        <canvas bind:this={starsChartElement}></canvas>
    </div>
    <div>
        <h2>Project Categories Distribution</h2>
        <canvas bind:this={categoriesChartElement}></canvas>
    </div>
</main>
