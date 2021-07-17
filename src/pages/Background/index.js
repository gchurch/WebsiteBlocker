chrome.runtime.onInstalled.addListener(function () {
    console.log("Hello World!");
    var updateRuleOptions = {
        removeRuleIds: [],
        addRules: []
    }
    chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions, () => {
        console.log("Refreshed blocking rules.");
    });
});