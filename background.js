let activeTabId = null;
let startTime = null;
let focusStartTime = null;
const focusRewardTime = 10; // ✅ Test Mode: Reward after 10 seconds

// Default distraction sites
const defaultDistractionSites = [
    "youtube.com",
    "twitter.com",
    "reddit.com",
    "instagram.com",
    "tiktok.com",
    "facebook.com"
];

console.log("✅ Focus Tracker background script is running!");

// Load distraction sites from storage (or use default)
function getDistractionSites(callback) {
    chrome.storage.local.get(["distractionSites"], (data) => {
        let userSites = data.distractionSites || defaultDistractionSites;
        callback(userSites);
    });
}

// Function to check if a URL is a distraction
function isDistractionSite(url, sites) {
    return sites.some(site => url.includes(site));
}

// Function to show a Chrome notification
function showNotification(title, message) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icons/icon48.png"),
        title: title,
        message: message,
        priority: 2
    }, () => {
        if (chrome.runtime.lastError) {
            console.error("❌ Notification Error:", chrome.runtime.lastError.message);
        } else {
            console.log(`✅ Notification sent: ${title}`);
        }
    });
}

// Detect when a new tab is activated
chrome.tabs.onActivated.addListener((activeInfo) => {
    if (activeTabId !== null && startTime !== null) {
        let timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);

        // Store all time spent
        chrome.storage.local.get(["totalFocusTime"], (data) => {
            let totalFocusTime = data.totalFocusTime || 0;
            totalFocusTime += timeSpentSeconds;

            chrome.storage.local.set({ totalFocusTime }, () => {
                console.log(`⏳ Tab ${activeTabId} - Time Spent: ${timeSpentSeconds} sec`);
                console.log(`📊 Total Focus Time: ${totalFocusTime} sec`);
            });
        });
    }

    // Get the new active tab
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab && tab.url) {
            console.log(`📌 Switched to: ${tab.url}`);

            getDistractionSites((sites) => {
                if (isDistractionSite(tab.url, sites)) {
                    showNotification("⚠️ Stay Focused!", "You switched to a distraction site.");
                    console.warn("🚨 Warning: Distraction site detected!", tab.url);
                    focusStartTime = null; // Reset focus tracking
                } else {
                    if (!focusStartTime) {
                        focusStartTime = Date.now(); // Start focus timer if not already started
                    } else {
                        let focusTime = Math.round((Date.now() - focusStartTime) / 1000);
                        if (focusTime >= focusRewardTime) {
                            showNotification("🎉 Great Job!", "You've stayed focused for 10 seconds! 🚀");
                            focusStartTime = null; // Reset the timer after sending reward
                        }
                    }
                }
            });
        }
    });

    activeTabId = activeInfo.tabId;
    startTime = Date.now();
});

