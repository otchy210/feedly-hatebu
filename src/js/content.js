const sendMessage = (action, payload) => {
    return new Promise(resolve => {
        chrome.runtime.sendMessage(chrome.runtime.id, {action, payload}, null, resolve);
    });
}

const jsonpScript = document.createElement('script');
const jsonpCallbackName = 'feedlyHatebuJsonpCallback';
const jsonResultIdPrefix = 'feedlyHatebuResult'
jsonpScript.innerHTML = `
const ${jsonpCallbackName} = (json) => {
    if (!json) {
        return;
    }
    const script = document.createElement('script');
    script.setAttribute('type', 'text/json');
    script.setAttribute('id', \`${jsonResultIdPrefix}-\${json.requested_url}\`);
    script.innerHTML = JSON.stringify(json);
    document.head.appendChild(script);
};
`;
document.head.appendChild(jsonpScript);

const waitFor = (msec) => {
    return new Promise(resolve => {
        setTimeout(resolve, msec);
    });
}

const awaitResult = async (url) => {
    const timeout = 2000;
    let msec = 100;
    while (true) {
        await waitFor(msec);
        const resultNode = document.getElementById(`${jsonResultIdPrefix}-${url}`);
        if (resultNode) {
            const result = JSON.parse(resultNode.innerHTML);
            document.head.removeChild(resultNode);
            return result;
        } else if (msec > timeout) {
            return false;
        }
        msec *= 1.2;
    }
};

const getHatebu = async (url) => {
    const chachedHatebu = await sendMessage('GET_HATEBU_CACHE', {url});
    if (chachedHatebu) {
        return chachedHatebu;
    }
    const encodedUrl = encodeURIComponent(url);
    const jsonpUrl = `https://b.hatena.ne.jp/entry/jsonlite/?url=${encodedUrl}&callback=${jsonpCallbackName}`;
    const script = document.createElement('script');
    script.setAttribute('src', jsonpUrl);
    script.setAttribute('async', 'async');
    document.head.appendChild(script);
    const result = await awaitResult(url);
    document.head.removeChild(script);
    if (!result) {
        return false;
    }
    return await sendMessage('CACHE_HATEBU', {result});
};

const createBadge = (hatebu) => {
    const {count, entry} = hatebu;
    const badge = document.createElement('span');
    const link = document.createElement('a');
    link.setAttribute('href', entry);
    link.setAttribute('target', '_blank');
    link.innerText = count;
    badge.appendChild(link);
    return badge;
};

const getHabetuBadge = async (url) => {
    const hatebu = await getHatebu(url);
    if (!hatebu) {
        return false;
    }
    return createBadge(hatebu);
};

const handleEntry = async (entry) => {
    const url = entry.getAttribute('data-alternate-link');
    const badge = await getHabetuBadge(url);
    if (!badge) {
        return;
    }
    const content = entry.querySelector('.content');
    content.insertBefore(badge, content.firstChild);
};

const handleU100Entry = async (entry) => {
    const url = entry.getAttribute('data-alternate-link');
    const badge = await getHabetuBadge(url);
    if (!badge) {
        return;
    }
    const metadata = entry.querySelector('.metadata.EntryMetadata');
    metadata.insertBefore(badge, metadata.firstChild);
};

document.addEventListener('DOMNodeInserted', (e) => {
    if (!e.target || !e.target.querySelectorAll) {
        return;
    }
    const entries = e.target.querySelectorAll('.entry');
    const u100Entries = e.target.querySelectorAll('.u100Entry');
    if (entries.length === 0 && u100Entries.length === 0) {
        return;
    }
    for (const entry of entries) {
        handleEntry(entry);
    }
    for (const u100entry of u100Entries) {
        handleU100Entry(u100entry);
    }
});
