import appConfig from './appConfig.js';
import { enableBlocking, disableBlocking, sleep, retryRequest } from './utils.js';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({enabled: false});
    chrome.action.setBadgeText({text: 'OFF'});
    chrome.action.setBadgeTextColor({color: '#ffffff'});
    chrome.action.setBadgeBackgroundColor({color: '#ff0000'});
});

chrome.action.onClicked.addListener(async () => {
    const { enabled } = await chrome.storage.local.get(['enabled']);
    chrome.storage.local.set({enabled: !enabled});
});

chrome.storage.onChanged.addListener(async (changes) => {
    chrome.action.setBadgeTextColor({color: '#ffffff'});
    if(changes?.enabled?.newValue) {
        await enableBlocking();
        chrome.action.setBadgeText({text: 'ON'});
        chrome.action.setBadgeBackgroundColor({color: '#12c399'}); // green
    } else {
        await disableBlocking();
        chrome.action.setBadgeText({text: 'OFF'});
        chrome.action.setBadgeBackgroundColor({color: '#ff0000'});
    }
});

chrome.webRequest.onBeforeRequest.addListener(async (requestDetails) => {
    const { enabled } = await chrome.storage.local.get(['enabled']);
    if(!enabled) {
        return;
    }

    await disableBlocking();

    await sleep(appConfig.delayTimeInMS);

    await chrome.scripting.executeScript({
        world: 'MAIN',
        target: {tabId: requestDetails.tabId},
        args: [requestDetails, appConfig.retryParameterName, appConfig.retryParameterValue],
        func: retryRequest
    });

    await enableBlocking();
}, 
{
    urls: [appConfig.urlFilter]
});