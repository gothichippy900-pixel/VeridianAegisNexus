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
          const startSVTListener = () => {
            const q = query(svtCollectionRef(), orderBy("timestamp_epoch", "desc"), limit(10));

            onSnapshot(q, (snapshot) => {
                const svtLog = document.getElementById('svt-log');
                svtLog.innerHTML = '';
                
                const chartData = []; // NEW: Array to hold data for charts

                snapshot.forEach((docSnap) => {
                    const docId = docSnap.id;
                    const data = docSnap.data();
                    const isPending = data.status === 'PENDING_CONSENSUS';
                    
                    // (Keep the existing processSVT kickoff logic here)
                    if (isPending && !data.processing_did) { // Check if it hasn't been picked up by a simulator yet
                        processSVT(docId, data.energy_signature);
                    }
                    // ------------------------------------

                    // NEW: Collect data for the charts
                    if (data.timestamp_epoch && data.manifestation_potential) {
                         const timestamp = data.timestamp_epoch.toDate ? data.timestamp_epoch.toDate() : new Date();
                         chartData.push({
                            time: timestamp.toLocaleTimeString('en-US'),
                            potential: data.manifestation_potential,
                            energy: data.energy_signature
                        });
                    }

                    // (Keep the existing log display logic here)
                    const statusColor = isPending ? 'text-yellow-400' : 'text-accent-green';
                    const potentialText = data.manifestation_potential ? `| Potential: ${data.manifestation_potential.toFixed(4)}` : '';
                    
                    const logItem = document.createElement('div');
                    logItem.className = `log-item text-xs md:text-sm ${statusColor}`;
                    logItem.innerHTML = `
                        <span class="font-bold">${data.intent.toUpperCase()}</span> 
                        <span class="text-xs text-white/50">(${data.did.substring(0, 8)}...)</span>
                        <br>
                        <span class="text-white/80">${data.status}</span> ${potentialText}
                    `;
                    svtLog.appendChild(logItem);
                });
                
                // NEW: Update the charts after collecting all data
                updateCharts(chartData.reverse()); 

            }, (error) => {
                // ... (error handling remains the same)
            });
        };

