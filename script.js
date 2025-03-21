// Update Slider Values and Risk Calculations
document.querySelectorAll("input[type='range']").forEach(slider => {
    slider.addEventListener("input", () => {
        const sliderValue = slider.nextElementSibling;
        sliderValue.innerText = slider.value; // Update displayed slider value
        updateRiskScore(); // Recalculate risk score dynamically
        updateRecommendations(); // Generate recommendations dynamically
        initializeRadarChart(); // Update radar chart dynamically
    });
});

// Dynamic Risk Calculations
function updateRiskScore() {
    const weights = {
        invasiveSpecies: 0.28,
        pathogenSpread: 0.22,
        contamination: 0.18,
        transportation: 0.12,
        quarantineBreach: 0.10,
        trainingCompliance: 0.10,
        supplyChain: 0.10,
    };

    const invasiveSpeciesValue = parseInt(document.getElementById("invasive-species").value) * weights.invasiveSpecies;
    const pathogenSpreadValue = parseInt(document.getElementById("pathogen-spread").value) * weights.pathogenSpread;
    const contaminationValue = parseInt(document.getElementById("contamination").value) * weights.contamination;
    const transportationValue = parseInt(document.getElementById("transportation").value) * weights.transportation;
    const quarantineBreachValue = parseInt(document.getElementById("quarantine-breach").value) * weights.quarantineBreach;
    const trainingComplianceValue = parseInt(document.getElementById("training-compliance").value) * weights.trainingCompliance;
    const supplyChainValue = parseInt(document.getElementById("supply-chain").value) * weights.supplyChain;

    const totalRiskScore = Math.round(
        invasiveSpeciesValue + pathogenSpreadValue + contaminationValue + transportationValue +
        quarantineBreachValue + trainingComplianceValue + supplyChainValue
    );

    const riskScoreElement = document.getElementById("risk-score");
    riskScoreElement.innerText = totalRiskScore;

    const riskLevelElement = document.getElementById("risk-level");
    if (totalRiskScore <= 30) {
        riskLevelElement.innerText = "Low Risk";
        riskLevelElement.style.color = "green";
    } else if (totalRiskScore <= 60) {
        riskLevelElement.innerText = "Moderate Risk";
        riskLevelElement.style.color = "orange";
    } else {
        riskLevelElement.innerText = "High Risk";
        riskLevelElement.style.color = "red";
    }
}

// Recommendations Based on Risks
function updateRecommendations() {
    const recommendations = [];
    if (parseInt(document.getElementById("invasive-species").value) > 50) {
        recommendations.push("Implement decontamination protocols for equipment and personnel.");
    }
    if (parseInt(document.getElementById("pathogen-spread").value) > 50) {
        recommendations.push("Enforce quarantine measures to prevent pathogen spread.");
    }
    if (parseInt(document.getElementById("contamination").value) > 50) {
        recommendations.push("Establish buffer zones and avoid contamination-prone areas.");
    }
    if (parseInt(document.getElementById("transportation").value) > 50) {
        recommendations.push("Limit or monitor transportation to minimize biohazard risks.");
    }
    if (parseInt(document.getElementById("quarantine-breach").value) > 50) {
        recommendations.push("Strengthen quarantine protocols and containment measures.");
    }
if (parseInt(document.getElementById("training-compliance").value) > 50) {
    recommendations.push("High-risk detected in biosecurity training compliance—mandatory workshops and stricter monitoring recommended.");
} else if (parseInt(document.getElementById("training-compliance").value) < 50) {
    recommendations.push("Increase biosecurity training and compliance monitoring.");
}
    if (parseInt(document.getElementById("supply-chain").value) > 50) {
        recommendations.push("Conduct audits on suppliers and enforce stricter import protocols.");
    }

    const distanceEcosystem = parseInt(document.getElementById("distance-ecosystem").value);
    if (distanceEcosystem < 5) {
        recommendations.push("Site is near sensitive ecosystems—enhanced protection measures recommended.");
    }

    const landUseHistory = document.getElementById("land-use-history").value.trim().toLowerCase();
    if (landUseHistory.includes("farming") || landUseHistory.includes("industrial")) {
        recommendations.push("Potential contamination detected—conduct soil and water quality tests.");
    }

    const recommendationsContainer = document.getElementById("recommendations");
    recommendationsContainer.innerHTML = recommendations.length
        ? `<ul>${recommendations.map(rec => `<li>${rec}</li>`).join("")}</ul>`
        : "No significant risks detected. Monitoring recommended.";
}

// Radar Chart Initialization
function initializeRadarChart() {
    const ctx = document.getElementById("impact-chart").getContext("2d");
    const chartData = {
        labels: ["Invasive Species", "Pathogen Spread", "Contamination", "Transportation", "Quarantine Breach", "Training Compliance", "Supply Chain Risk"],
        datasets: [
            {
                label: "Risk Levels",
                data: [
                    parseInt(document.getElementById("invasive-species").value),
                    parseInt(document.getElementById("pathogen-spread").value),
                    parseInt(document.getElementById("contamination").value),
                    parseInt(document.getElementById("transportation").value),
                    parseInt(document.getElementById("quarantine-breach").value),
                    parseInt(document.getElementById("training-compliance").value),
                    parseInt(document.getElementById("supply-chain").value),
                ],
                backgroundColor: "rgba(0, 122, 108, 0.2)", // Teal with transparency
                borderColor: "rgba(0, 122, 108, 1)", // Solid teal
                borderWidth: 2,
            },
        ],
    };

    const radarChartConfig = {
        type: "radar",
        data: chartData,
        options: {
            responsive: true,
            scales: {
                r: {
                    min: 0, // Ensure minimum value is 0
                    max: 100, // Cap the maximum value at 100
                    ticks: {
                        stepSize: 20, // Add steps for better visualization
                        showLabelBackdrop: false, // Removes label backgrounds for cleaner look
                        color: "#333", // Neutral color for tick labels
                    },
                    grid: {
                        circular: true, // Make grid lines circular for radar chart
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                },
            },
        },
    };

    if (window.radarChart) {
        window.radarChart.destroy();
    }
    window.radarChart = new Chart(ctx, radarChartConfig);
}

document.addEventListener("DOMContentLoaded", () => {
    initializeRadarChart();
});

// Save Data to CSV
document.getElementById("save-local").addEventListener("click", () => {
    const headers = [
        "Field",
        "Value",
    ];

    const data = [
        ["Project Name", document.getElementById("project-name").value || "N/A"],
        ["Location", document.getElementById("location").value || "N/A"],
        ["Assessor Name", document.getElementById("assessor-name").value || "N/A"],
        ["Date of Assessment", document.getElementById("date").value || "N/A"],
        ["Project Description", document.getElementById("project-description").value || "N/A"],
        ["Project Purpose", document.getElementById("project-purpose").value || "N/A"],
        ["Flora & Fauna", document.getElementById("flora-fauna").value || "N/A"],
        ["Environmental Features", Array.from(document.getElementById("environmental-features").selectedOptions).map(option => option.value).join(", ") || "N/A"],
        ["Distance to Sensitive Ecosystems (km)", document.getElementById("distance-ecosystem").value || "N/A"],
        ["Distance to Critical Infrastructure (km)", document.getElementById("distance-infrastructure").value || "N/A"],
        ["Land Use History", document.getElementById("land-use-history").value || "N/A"],
        ["Current Site Activities", document.getElementById("current-activities").value || "N/A"],
        ["Site Accessibility", document.getElementById("accessibility").value || "N/A"],
        ["Invasive Species Risk", document.getElementById("invasive-species").value || "0"],
        ["Pathogen Spread Risk", document.getElementById("pathogen-spread").value || "0"],
        ["Contamination Risk", document.getElementById("contamination").value || "0"],
        ["Transportation Risk", document.getElementById("transportation").value || "0"],
        ["Quarantine Breach Risk", document.getElementById("quarantine-breach").value || "0"],
        ["Training Compliance", document.getElementById("training-compliance").value || "0"],
        ["Supply Chain Risk", document.getElementById("supply-chain").value || "0"],
    ];

    const csvContent = [
        headers.join(","),
        ...data.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href",     url);
    link.setAttribute("download", "Biosecurity_Risk_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Delete Data with Confirmation
document.getElementById("delete-data").addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all data? This action cannot be undone.")) {
        document.querySelectorAll("form input, form textarea, form select").forEach(input => {
            if (input.type === "range") {
                input.value = 0;
            } else if (input.tagName === "SELECT" && input.multiple) {
                Array.from(input.options).forEach(option => option.selected = false);
            } else {
                input.value = "";
            }
        });

        updateRiskScore();
        updateRecommendations();
        initializeRadarChart();
        alert("All data has been cleared.");

        // Refresh the page to fully reset the state
        location.reload();
    }
});

// Generate PDF Report
document.getElementById("generate-report").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;

    const pdfName = prompt("Enter the file name for your PDF:", "Biosecurity_Risk_Report") || "Biosecurity_Risk_Report";

    try {
        const doc = new jsPDF();
        const headerColor = "#007a6c"; // Teal for headings and subheadings
        const textColor = "#333"; // Black for user inputs
        const sectionTitleFontSize = 14;
        const subHeadingFontSize = 12;
        const textFontSize = 12;
        const footerFontSize = 10; // Smaller font size for footer
        const margin = 10;
        const footerText = "Produced with Biosecurity Risk Assessment Tool by Jay Rowley";
        let yOffset = margin;

        const addPage = () => {
            doc.addPage();
            yOffset = margin;
        };

        const addFooter = (currentPage, totalPages) => {
            doc.setFontSize(footerFontSize);
            doc.setTextColor(textColor); // Footer text in black
            doc.text(
                `${footerText} - Page ${currentPage} of ${totalPages}`,
                margin,
                doc.internal.pageSize.height - 10 // 10px from bottom
            );
        };

        const addSectionTitle = (title) => {
            if (yOffset > 270) addPage();
            doc.setFontSize(sectionTitleFontSize);
            doc.setTextColor(headerColor); // Teal for section titles
            doc.text(title, margin, yOffset);
            yOffset += 15;
        };

        const addSubHeadingAndText = (subHeading, text) => {
            doc.setFontSize(subHeadingFontSize);
            doc.setTextColor(headerColor); // Teal for subheadings
            if (yOffset > 270) addPage();
            doc.text(`${subHeading}:`, margin, yOffset);
            yOffset += 6;

            doc.setFontSize(textFontSize);
            doc.setTextColor(textColor); // Black for user inputs
            const splitText = doc.splitTextToSize(text, 180);
            splitText.forEach(line => {
                if (yOffset > 270) addPage();
                doc.text(line, margin, yOffset);
                yOffset += 6;
            });
            yOffset += 5;
        };

        // Add Title
        doc.setTextColor(headerColor);
        doc.setFontSize(18);
        doc.text("Biosecurity Risk Assessment Report", margin, yOffset);
        yOffset += 15;
        doc.setDrawColor(headerColor);
        doc.line(margin, yOffset, 200, yOffset);
        yOffset += 15;

        // Project Details Section
        addSectionTitle("Project Details");
        addSubHeadingAndText("Project Name", document.getElementById("project-name").value || "N/A");
        addSubHeadingAndText("Location", document.getElementById("location").value || "N/A");
        addSubHeadingAndText("Assessor Name", document.getElementById("assessor-name").value || "N/A");
        addSubHeadingAndText("Date of Assessment", document.getElementById("date").value || "N/A");
        addSubHeadingAndText("Project Description", document.getElementById("project-description").value || "N/A");
        addSubHeadingAndText("Project Purpose", document.getElementById("project-purpose").value || "N/A");

        // Site Information Section
        addSectionTitle("Site Information");
        addSubHeadingAndText("Flora & Fauna", document.getElementById("flora-fauna").value || "N/A");
        const environmentalFeatures = Array.from(document.getElementById("environmental-features").selectedOptions)
            .map(option => option.value).join(", ");
        addSubHeadingAndText("Environmental Features", environmentalFeatures || "N/A");
        addSubHeadingAndText("Distance to Sensitive Ecosystems (km)", document.getElementById("distance-ecosystem").value || "N/A");
        addSubHeadingAndText("Distance to Critical Infrastructure (km)", document.getElementById("distance-infrastructure").value || "N/A");
        addSubHeadingAndText("Land Use History", document.getElementById("land-use-history").value || "N/A");
        addSubHeadingAndText("Current Site Activities", document.getElementById("current-activities").value || "N/A");
        addSubHeadingAndText("Site Accessibility", document.getElementById("accessibility").value || "N/A");

        // Recommendations Section
        addSectionTitle("Recommendations");
        const recommendationsText = document.getElementById("recommendations").innerText || "No recommendations available.";
        const recommendationsSplit = doc.splitTextToSize(recommendationsText, 180);
        recommendationsSplit.forEach(line => {
            if (yOffset > 270) addPage();
            doc.text(line, margin, yOffset);
            yOffset += 6;
        });

        // Radar Chart Section
        addPage();
        const chartCanvas = document.getElementById("impact-chart");
        if (chartCanvas) {
            const chartImage = chartCanvas.toDataURL("image/png");
            const chartWidth = 180;
            const chartHeight = (chartCanvas.height / chartCanvas.width) * chartWidth;
            doc.addImage(chartImage, "PNG", margin, yOffset, chartWidth, chartHeight);
            yOffset += chartHeight + 10;
        }

        // Add footer to all pages
        const totalPages = doc.internal.getNumberOfPages(); // Dynamically calculate total pages
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            addFooter(i, totalPages);
        }

        // Save the PDF
        doc.save(`${pdfName}.pdf`);
    } catch (error) {
        alert("An error occurred during PDF generation: " + error.message);
        console.error(error);
    }
});
