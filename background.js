let activeTabId = null;
let startTime = null;

chrome.tabs.onActivated.addListener(activeInfo => {
    if (activeTabId !== null && startTime !== null) {
        let timeSpent = Date.now() - startTime;
        console.log(`Tab ${activeTabId} - Time Spent: ${timeSpent / 1000} 
sec`);
    }

    activeTabId = activeInfo.tabId;
    startTime = Date.now();
});

