chrome.runtime.onInstalled.addListener(function () {
    setInterval(() => {
        console.log("Hello World!");
        var key = "a";
        var value = "1";
        chrome.storage.local.set({ key: value }, function () {
            console.log('Value is set to ' + value);
        });
    }, 3000);

    var alarmName = 'remindme';

    chrome.alarms.onAlarm.addListener(function (alarm) {
        console.log("Got an alarm!", alarm);
    });

    chrome.alarms.create(alarmName, {
        delayInMinutes: 0.01, periodInMinutes: 0.01
    });
});