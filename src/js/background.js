import NodeCache from 'node-cache';
import { getSynced, setSynced } from './common';

const hatebuCache = new NodeCache({stdTTL: 600, checkperiod: 60});

const getHatebuCache = (payload, callback) => {
    const { url } = payload;
    if (hatebuCache.has(url)) {
        callback(hatebuCache.get(url));
    } else {
        callback(false);
    }
};

const cacheHatebu = (payload, callback) => {
    const { result } = payload;
    const url = result.requested_url;
    const hatebu = {
        count: result.count,
        entry: result.entry_url,
    };
    hatebuCache.set(url, hatebu);
    callback(hatebu);
}

// handle messages
const messageHandler = async (message, sender, callback) => {
    const {action, payload} = message;
    switch (action) {
        case 'GET_HATEBU_CACHE':
            getHatebuCache(payload, callback);
            break;
        case 'CACHE_HATEBU':
            cacheHatebu(payload, callback);
            break;
    }
    return true;
};
chrome.runtime.onMessage.addListener(messageHandler);
chrome.runtime.onMessageExternal.addListener(messageHandler);

// extension icon clicked
chrome.browserAction.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage();
});

const init = async () => {
    const currentVersion = chrome.runtime.getManifest().version;
    const seenVersion = await getSynced('seenVersion', '');
    if (currentVersion !== seenVersion) {
        setSynced('seenVersion', currentVersion);
        chrome.runtime.openOptionsPage();
    }
    chrome.management.get(chrome.runtime.id, ({ installType }) => {
        if (installType === 'development') {
            chrome.runtime.openOptionsPage();
        }
    });
};
init();
