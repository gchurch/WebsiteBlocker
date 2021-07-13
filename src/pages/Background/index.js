chrome.runtime.onInstalled.addListener(function () {
    console.log("Hello World!");

    const key = "a";
    const value = 1;
    chrome.storage.local.set({ key: value }, function () {
        console.log(key + " set to " + value);
        chrome.storage.local.get(key, function (data) {
            console.log("retrieved " + key + " from storage with value " + data[key]);
        })
    })
});