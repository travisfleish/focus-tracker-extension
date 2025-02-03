document.getElementById("reset").addEventListener("click", () => {
    chrome.storage.local.clear(() => {
        document.getElementById("status").innerText = "Focus data reset!";
    });
});

