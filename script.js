// JavaScript for Biosecurity Risk Assessment Tool

// Function to update risk value outputs
function updateRiskValues(sliderId, outputId) {
    const slider = document.getElementById(sliderId);
    const output = document.getElementById(outputId);
    output.textContent = slider.value;
}

// Function to calculate total Biosecurity Risk Score
function calculateRiskScore() {
    const invasiveRisk = parseInt(document.getElementById('invasive-species').value) || 0;
    const pathogenRisk = parseInt(document.getElementById('pathogen-spread').value) || 0;
    const contaminationRisk = parseInt(document.getElementById('contamination-risk').value) || 0;
    const transportationRisk = parseInt(document.getElementById('transportation-risk').value) || 0;
    const quarantineRisk = parseInt(document.getElementById('quarantine-breach').value) || 0;

    // Weighted calculation
    const totalRisk = Math.round(
        invasiveRisk * 0.3 +
        pathogenRisk * 0.25 +
        contaminationRisk * 0.2 +
        transportationRisk * 0.15 +
        quarantineRisk * 0.1
    );

    document.getElementById('risk-score').textContent = totalRisk;

    // Risk level determination
    let riskLevel = "Low Risk";
    if (totalRisk > 30 && totalRisk <= 60) {
        riskLevel = "Moderate Risk";
    } else if (totalRisk > 60) {
        riskLevel = "High Risk";
    }
    document.getElementById('risk-level').textContent = riskLevel;

    generateRecommendations(); // Ensure recommendations display
    updateRadarChart(); // Update radar chart with new data
}

// Function to generate recommendations based on slider values
function generateRecommendations() {
    const recommendations = [];
    if (parseInt(document.getElementById('invasive-species').value) > 50) {
        recommendations.push("Implement decontamination protocols for equipment and personnel.");
    }
    if (parseInt(document.getElementById('pathogen-spread').value) > 50) {
        recommendations.push("Enforce quarantine measures to prevent pathogen spread.");
    }
    if (parseInt(document.getElementById('contamination-risk').value) > 50) {
        recommendations.push("Establish buffer zones and avoid contamination-prone areas.");
    }
    if (parseInt(document.getElementById('transportation-risk').value) > 50) {
        recommendations.push("Limit or monitor transportation to minimize biohazard risks.");
    }
    if (parseInt(document.getElementById('quarantine-breach').value) > 50) {
        recommendations.push("Strengthen quarantine protocols and containment measures.");
    }

    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = `<ul>${recommendations.map(rec => `<li>${rec}</li>`).join("")}</ul>`;
}

// Function to update radar chart
function updateRadarChart() {
    const ctx = document.getElementById('biosecurity-chart').getContext('2d');
    const data = {
        labels: [
            "Invasive Species Risk",
            "Pathogen Spread Risk",
            "Contamination Risk",
            "Transportation Risk",
            "Quarantine Breach Risk"
        ],
        datasets: [{
            label: "Biosecurity Metrics",
            data: [
                parseInt(document.getElementById('invasive-species').value) || 0,
                parseInt(document.getElementById('pathogen-spread').value) || 0,
                parseInt(document.getElementById('contamination-risk').value) || 0,
                parseInt(document.getElementById('transportation-risk').value) || 0,
                parseInt(document.getElementById('quarantine-breach').value) || 0
            ],
            backgroundColor: "rgba(0, 123, 143, 0.4)",
            borderColor: "rgba(0, 123, 143, 1)",
            borderWidth: 2
        }]
    };

    if (window.biosecurityChart) {
        window.biosecurityChart.data = data;
        window.biosecurityChart.update();
    } else {
        window.biosecurityChart = new Chart(ctx, {
            type: "radar",
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scale: {
                    ticks: { beginAtZero: true }
                }
            }
        });
    }
}

// Function to reset all form inputs and clear the chart and recommendations
function clearData() {
    document.querySelectorAll('input, textarea').forEach(input => {
        if (input.type === 'range') {
            input.value = 0;
            updateRiskValues(input.id, `${input.id}-value`);
        } else {
            input.value = '';
        }
    });

    // Reset risk score and recommendations
    document.getElementById('risk-score').textContent = '0';
    document.getElementById('risk-level').textContent = 'Low Risk';
    document.getElementById('recommendations').innerHTML = '';

    // Reset the radar chart
    if (window.biosecurityChart) {
        window.biosecurityChart.destroy();
        window.biosecurityChart = null;
    }
}

document.getElementById('delete-data').addEventListener('click', clearData);

// Other functions (CSV export, PDF export) remain unchanged
