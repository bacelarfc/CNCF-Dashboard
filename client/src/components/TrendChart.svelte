<script>
    import { onMount } from "svelte";
    import { Chart, registerables } from "chart.js";
    Chart.register(...registerables);
    let chartRef;
    let categoryData = { labels: [], datasets: [] };

    onMount(async () => {
        const response = await fetch(
            "http://localhost:8081/api/category-distribution",
        );
        if (response.ok) {
            const data = await response.json();
            categoryData.labels = Object.keys(data);
            categoryData.datasets = [
                {
                    label: "Number of Projects",
                    data: Object.values(data),
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                },
            ];

            createChart();
        }
    });

    function createChart() {
        const ctx = chartRef.getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: categoryData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }
</script>

<canvas bind:this={chartRef}></canvas>
