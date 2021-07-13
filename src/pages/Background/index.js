chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
        console.log("Retrieved existing rules.");
        var existingRuleIds = [];
        for (var rule of rules) {
            existingRuleIds.push(rule.id)
        }
        console.log(existingRuleIds);
        var updateRuleOptions = {
            removeRuleIds: existingRuleIds,
            addRules: []
        }
        chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions, () => {
            console.log("Updated rules.");
        });
    });
});