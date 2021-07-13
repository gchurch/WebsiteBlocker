chrome.runtime.onInstalled.addListener(function () {
    var updateRuleOptions = {
        removeRuleIds: [],
        addRules: []
    }
    chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions, () => {
        console.log("Updated blocking rules with no changes.");
    });
});