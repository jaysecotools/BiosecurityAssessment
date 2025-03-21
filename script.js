// JavaScript for Biosecurity Risk Assessment Tool

// Function to update risk value outputs
function updateRiskValues(sliderId, outputId) {
    const slider = document.getElementById(sliderId);
    const output = document.getElementById(outputId);
    output.textContent = slider.value;
}

// Function to calculate total Biosecurity Risk Score
function calculateRiskScore() {
    const invasiveRisk = parseInt(document.getElementById('invasive-species').value);
    const pathogenRisk = parseInt(document.getElementById('pathogen-spread').value);
    const contaminationRisk = parseInt(document.getElementById('contamination-risk').value);
    const transportationRisk = parseInt(document.getElementById('transportation-risk').value);
    const quarantineRisk = parseInt(document.getElementById('quarantine-breach').value);

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

    generateRecommendations();
    updateRadarChart();
}

// Function to generate recommendations based on slider values
function generateRecommendations() {
    const recommendations = [];
    if (document.getElementById('invasive-species').value > 50) {
        recommendations.push("Implement decontamination protocols for equipment and personnel.");
    }
    if (document.getElementById('pathogen-spread').value > 50) {
        recommendations.push("Enforce quarantine measures to prevent pathogen spread.");
    }
    if (document.getElementById('contamination-risk').value > 50) {
        recommendations.push("Establish buffer zones and avoid contamination-prone areas.");
    }
    if (document.getElementById('transportation-risk').value > 50) {
        recommendations.push("Limit or monitor transportation to minimize biohazard risks.");
    }
    if (document.getElementById('quarantine-breach').value > 50) {
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
                document.getElementById('invasive-species').value,
                document.getElementById('pathogen-spread').value,
                document.getElementById('contamination-risk').value,
                document.getElementById('transportation-risk').value,
                document.getElementById('quarantine-breach').value
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
                scale: {
                    ticks: { beginAtZero: true }
                }
            }
        });
    }
}

// Event Listeners for Sliders
document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener('input', () => {
        updateRiskValues(slider.id, `${slider.id}-value`);
        calculateRiskScore();
    });
});

// Function to export data as CSV
function exportCSV() {
    const csvContent = [
        ["Metric", "Value"],
        ["Invasive Species Risk", document.getElementById('invasive-species').value],
        ["Pathogen Spread Risk", document.getElementById('pathogen-spread').value],
        ["Contamination Risk", document.getElementById('contamination-risk').value],
        ["Transportation Risk", document.getElementById('transportation-risk').value],
        ["Quarantine Breach Risk", document.getElementById('quarantine-breach').value],
        ["Total Risk Score", document.getElementById('risk-score').textContent],
        ["Risk Level", document.getElementById('risk-level').textContent]
    ];

    const csvString = csvContent.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "biosecurity-risk-assessment.csv";
    a.click();
}

document.getElementById('save-local').addEventListener('click', exportCSV);

// Function to generate PDF report
function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("Arial", "bold");
    doc.text("Biosecurity Risk Assessment Report", 10, 10);
    doc.setFont("Arial", "normal");
    doc.text(`Project Name: ${document.getElementById("project-name").value}`, 10, 20);
    doc.text(`Location: ${document.getElementById("location").value}`, 10, 30);
    doc.text(`Assessor Name: ${document.getElementById("assessor-name").value}`, 10, 40);
    doc.text(`Date: ${document.getElementById("date").value}`, 10, 50);

    doc.text("Biosecurity Metrics:", 10, 70);
    doc.text(`- Invasive Species Risk: ${document.getElementById('invasive-species').value}`, 10, 80);
    doc.text(`- Pathogen Spread Risk: ${document.getElementById('pathogen-spread').value}`, 10, 90);
    doc.text(`- Contamination Risk: ${document.getElementById('contamination-risk').value}`, 10, 100);
    doc.text(`- Transportation Risk: ${document.getElementById('transportation-risk').value}`, 10, 110);
    doc.text(`- Quarantine Breach Risk: ${document.getElementById('quarantine-breach').value}`, 10, 120);

    doc.text(`Total Risk Score: ${document.getElementById("risk-score").textContent}`, 10, 140);
    doc.text(`Risk Level: ${document.getElementById("risk-level").textContent}`, 10, 150);

    const recommendations = document.getElementById("recommendations").textContent;
    doc.text("Recommendations:", 10, 170);
    doc.text(recommendations, 10, 180);

    doc.save("biosecurity-risk-assessment.pdf");
}

document.getElementById('generate-report').addEventListener('click', exportPDF);
