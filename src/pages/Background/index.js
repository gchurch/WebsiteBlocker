chrome.runtime.onInstalled.addListener(function () {
    console.log("Hello World!");

    const key = "123";
    const value = 25;
    chrome.storage.local.set({ [key]: value }, function () {
        console.log(key + " set to " + value);
        chrome.storage.local.get(key, function (data) {
            console.log("retrieved " + key + " from storage with value " + data[key]);
        })
    })
});