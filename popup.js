document.addEventListener("DOMContentLoaded", () => {
    function updateFocusTime() {
        chrome.storage.local.get(["totalFocusTime"], (data) => {
            let focusTime = data.totalFocusTime || 0;
            document.getElementById("status").innerText = `Total Focus Time: ${focusTime} sec`;
        });
    }

    // Load stored focus time when the popup opens
    updateFocusTime();

    // Listen for storage changes in real-time
    chrome.storage.onChanged.addListener(() => {
        updateFocusTime();
    });

    // Ensure reset button exists
    const resetButton = document.getElementById("reset");
    if (resetButton) {
        resetButton.addEventListener("click", () => {
            console.log("🛑 Reset button clicked!");
            chrome.storage.local.set({ totalFocusTime: 0 }, () => {
                console.log("✅ Focus time reset!");
                updateFocusTime();
            });
        });
    }

    // Load distraction sites into the popup
    chrome.storage.local.get(["distractionSites"], (data) => {
        let sites = data.distractionSites || [];
        document.getElementById("custom-sites").value = sites.join("\n");
    });

    // Add a new distraction site
    document.getElementById("add-site").addEventListener("click", () => {
        let newSite = document.getElementById("site-input").value.trim();
        if (newSite) {
            chrome.storage.local.get(["distractionSites"], (data) => {
                let sites = data.distractionSites || defaultDistractionSites;
                if (!sites.includes(newSite)) {
                    sites.push(newSite);
                    chrome.storage.local.set({ distractionSites: sites }, () => {
                        console.log(`✅ Added new distraction site: ${newSite}`);
                        document.getElementById("custom-sites").value = sites.join("\n");
                        document.getElementById("site-input").value = ""; // Clear input field
                    });
                }
            });
        }
    });

    // Clear custom distraction sites
    document.getElementById("clear-sites").addEventListener("click", () => {
        chrome.storage.local.set({ distractionSites: [] }, () => {
            console.log("🗑️ Cleared all custom distraction sites.");
            document.getElementById("custom-sites").value = "";
        });
    });
});

