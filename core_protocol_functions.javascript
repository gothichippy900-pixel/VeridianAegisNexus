          // --- Visualization Functions ---
        
        const initializeCharts = (initialData) => {
            const labels = initialData.map(d => d.time);
            const potentials = initialData.map(d => d.potential);
            const energies = initialData.map(d => d.energy);

            // Chart 1: Protocol Health Index (PHI) - Tracks Manifestation Potential
            const phiCtx = document.getElementById('phi-chart').getContext('2d');
            phiChart = new Chart(phiCtx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Manifestation Potential',
                        data: potentials,
                        borderColor: 'rgba(42, 157, 143, 1)', // var(--color-accent-green)
                        backgroundColor: 'rgba(42, 157, 143, 0.2)',
                        tension: 0.3,
                        pointRadius: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, max: 1.05, title: { display: true, text: 'Potential (0-1)' } },
                        x: { display: false }
                    },
                    plugins: { legend: { display: false } }
                }
            });

            // Chart 2: Recent Energy Signatures
            const energyCtx = document.getElementById('energy-chart').getContext('2d');
            energyChart = new Chart(energyCtx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Energy Signature',
                        data: energies,
                        backgroundColor: 'rgba(231, 111, 81, 0.7)', // var(--color-hippie-bright)
                        borderColor: 'rgba(231, 111, 81, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true, max: 1050, title: { display: true, text: 'Energy (0-1024)' } },
                        x: { display: false }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        };
