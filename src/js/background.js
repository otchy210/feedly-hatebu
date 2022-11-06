import NodeCache from 'node-cache';
import { getSynced, setSynced, needsToNotify } from './common';

const ONE_HOUR = 60 * 60;
const FIVE_MINUTES = 60 * 5;
const hatebuCache = new NodeCache({stdTTL: ONE_HOUR, checkperiod: FIVE_MINUTES});

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

const getHatebu = async (payload, callback) => {
    const { url } = payload;
    if (hatebuCache.has(url)) {
        callback(hatebuCache.get(url));
        return;
    }
    const response = await fetch(`http://localhost:8102?url=${encodeURI(url)}`);
    const result = await response.json();
    const hatebu = result ? {
        count: result.count,
        entry: result.entry_url,
    } : {
        count: 0,
        entry: url
    };
    hatebuCache.set(url, hatebu);
    callback(hatebu);
}

// handle messages
chrome.runtime.onMessage.addListener(async (message, sender, callback) => {
    const {action, payload} = message;
    switch (action) {
        case 'GET_HATEBU_CACHE':
            getHatebuCache(payload, callback);
            break;
        case 'CACHE_HATEBU':
            cacheHatebu(payload, callback);
            break;
        case 'GET_HATEBU':
            getHatebu(payload, callback);
            break;
    }
    return true;
});

// extension icon clicked
chrome.action.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage();
});

const init = async () => {
    const currentVersion = chrome.runtime.getManifest().version;
    const seenVersion = await getSynced('seenVersion', '');
    if (needsToNotify(seenVersion, currentVersion)) {
        setSynced('seenVersion', currentVersion);
        chrome.runtime.openOptionsPage();
    }
    // chrome.management.get(chrome.runtime.id, ({ installType }) => {
    //     if (installType === 'development') {
    //         chrome.runtime.openOptionsPage();
    //     }
    // });
};
init();
