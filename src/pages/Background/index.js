chrome.runtime.onInstalled.addListener(function () {
    setInterval(() => {
        console.log("Hello World!");
    }, 3000);
});