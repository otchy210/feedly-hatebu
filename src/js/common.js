export const getSynced = (key, defaultValue) => {
    return new Promise(resolve => {
        chrome.storage.sync.get(key, (value) => {
            if (!value[key]) {
                resolve(defaultValue);
                return;
            }
            resolve(value[key]);
        });
    });
};

export const setSynced = (key, value) => {
    return new Promise(resolve => {
        const item = {[key]: value};
        chrome.storage.sync.set(item, () => {
            resolve(item);
        })
    });
};

export const sendMessage = (action, payload) => {
    return new Promise(resolve => {
        chrome.runtime.sendMessage(chrome.runtime.id, {action, payload}, null, resolve);
    });
};
