# Website Blocker

This browser extension allows you to create a list of websites that the browser is blocked from being able to visit. This can help you to stay away from distracting websites and boost your productivity. The time that each website has been blocked for is also displayed. This feature motivates you to keep the website blocked as unblocking the website will reset the timer and it feels like you have lost your progress.

The extension is published to the Edge and Chrome extension stores. At the time of writing, the Edge version has 5000+ users and 50+ ratings with an average of 4.5 stars.

[![Edge Add-ons](images/edge/badge.png)](https://microsoftedge.microsoft.com/addons/detail/simple-website-blocker/fbjngbafdijlfccooomdapgfebnlnicj)
[![Chrome Web Store](images/chrome/chrome_web_store_available.png)](https://chrome.google.com/webstore/detail/website-blocker/pohdmcmfjhjnocjjhoobmhbgonebakad)

There are similar extensions on the extension stores, but a lot of them require the permission 'Read and change all your data on the websites your visit'. This permission is a bit alarming, so I decided to implement my own extension which requires minimal permissions. The only permission this extension requires is 'Block content on any page you visit'.

## Technical Details

The GUI has been created using React. The extension uses Manifest V3. In order to block the websites, the chrome.declarativeNetRequest API is used. The following template was used for this extension: https://github.com/lxieyang/chrome-extension-boilerplate-react.

## Steps to run

- Run npm install to install the dependencies.
- Run npm start
- Load your extension on Chrome following:
  - Access chrome://extensions/
  - Check Developer mode
  - Click on Load unpacked extension
  - Select the build folder.

## Screenshots

![popup](screenshots/popup.png)

![options](screenshots/options.png)

![blocked](screenshots/blocked.png)
