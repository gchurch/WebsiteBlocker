chrome.runtime.onInstalled.addListener(function () {
    setInterval(() => {
        console.log("Hello World!");
        var key = "a";
        var value = "1";
        chrome.storage.local.set({ key: value }, function () {
            console.log('Value is set to ' + value);
        });
    }, 3000);
});