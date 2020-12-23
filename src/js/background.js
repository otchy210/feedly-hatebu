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

const init = async () => {
    const manifest = chrome.runtime.getManifest();
    const currentVersion = manifest.version;
    const seenVersion = await getSynced('seenVersion', '');
    if (currentVersion !== seenVersion) {
        setSynced('seenVersion', currentVersion);
        chrome.runtime.openOptionsPage();
    }
};
init();
